/**
 * Copyright (c) 2024
 *
 * Licensed under the MIT License
 */

import http from 'node:http';
import assert from 'node:assert';
import crypto from 'node:crypto';

import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { createConnection } from './index.js';
// No need to import Context as it's not used directly in this file

// Connection list to keep track of all active connections
const connectionList: any[] = [];

/**
 * Start a transport using standard input/output
 */
export async function startStdioTransport(options: {
  headless?: boolean;
  projectPath?: string;
  browser?: 'chrome' | 'firefox' | 'edge' | 'electron';
  detailedReports?: boolean;
}) {
  try {
    console.log('Starting Cypress MCP Server with stdio transport...');
    const connection = await createConnection(options);
    await connection.connect(new StdioServerTransport());
    connectionList.push(connection);
  } catch (error) {
    console.error('Failed to start stdio transport:', error);
    process.exit(1);
  }
}

/**
 * Handle SSE (Server-Sent Events) requests
 */
async function handleSSE(
  options: any,
  req: http.IncomingMessage,
  res: http.ServerResponse,
  url: URL,
  sessions: Map<string, SSEServerTransport>
) {
  if (req.method === 'POST') {
    const sessionId = url.searchParams.get('sessionId');
    if (!sessionId) {
      res.statusCode = 400;
      return res.end('Missing sessionId');
    }

    const transport = sessions.get(sessionId);
    if (!transport) {
      res.statusCode = 404;
      return res.end('Session not found');
    }

    return await transport.handlePostMessage(req, res);
  } else if (req.method === 'GET') {
    const transport = new SSEServerTransport('/sse', res);
    sessions.set(transport.sessionId, transport);
    console.log(`New SSE session created: ${transport.sessionId}`);
    
    const connection = await createConnection(options);
    await connection.connect(transport);
    connectionList.push(connection);
    
    res.on('close', () => {
      console.log(`SSE session closed: ${transport.sessionId}`);
      sessions.delete(transport.sessionId);
      connection.close().catch(e => {
        console.error('Error closing connection:', e);
      });
    });
    return;
  }

  res.statusCode = 405;
  res.end('Method not allowed');
}

/**
 * Handle streamable HTTP requests
 */
async function handleStreamable(
  options: any,
  req: http.IncomingMessage,
  res: http.ServerResponse,
  sessions: Map<string, StreamableHTTPServerTransport>
) {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  if (sessionId) {
    const transport = sessions.get(sessionId);
    if (!transport) {
      res.statusCode = 404;
      res.end('Session not found');
      return;
    }
    return await transport.handleRequest(req, res);
  }

  if (req.method === 'POST') {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => crypto.randomUUID(),
      onsessioninitialized: sessionId => {
        console.log(`New streamable HTTP session created: ${sessionId}`);
        sessions.set(sessionId, transport);
      }
    });
    
    transport.onclose = () => {
      if (transport.sessionId) {
        console.log(`Streamable HTTP session closed: ${transport.sessionId}`);
        sessions.delete(transport.sessionId);
      }
    };
    
    const connection = await createConnection(options);
    connectionList.push(connection);
    
    await Promise.all([
      connection.connect(transport),
      transport.handleRequest(req, res),
    ]);
    return;
  }

  res.statusCode = 400;
  res.end('Invalid request');
}

/**
 * Start an HTTP transport server
 */
export function startHttpTransport(options: {
  headless?: boolean;
  projectPath?: string;
  browser?: 'chrome' | 'firefox' | 'edge' | 'electron';
  detailedReports?: boolean;
  port?: number;
  hostname?: string;
}) {
  const port = options.port ?? 3000;
  const hostname = options.hostname ?? '0.0.0.0';
  
  // Track active sessions
  const sseSessions = new Map<string, SSEServerTransport>();
  const streamableSessions = new Map<string, StreamableHTTPServerTransport>();
  
  // Create HTTP server
  const httpServer = http.createServer(async (req, res) => {
    try {
      if (!req.url) {
        res.statusCode = 400;
        return res.end('Missing URL');
      }
      
      // Handle health check
      if (req.url === '/health') {
        res.statusCode = 200;
        return res.end('OK');
      }
      
      const url = new URL(`http://localhost${req.url}`);
      
      // Route requests to appropriate handler
      if (url.pathname.startsWith('/mcp'))
        await handleStreamable(options, req, res, streamableSessions);
      else
        await handleSSE(options, req, res, url, sseSessions);
    } catch (error) {
      console.error('Error handling request:', error);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });
  
  // Start listening
  httpServer.listen(port, hostname, () => {
    const address = httpServer.address();
    assert(address, 'Could not bind server socket');
    
    let url: string;
    if (typeof address === 'string') {
      url = address;
    } else {
      const resolvedPort = address.port;
      let resolvedHost = address.family === 'IPv4' ? address.address : `[${address.address}]`;
      if (resolvedHost === '0.0.0.0' || resolvedHost === '[::]')
        resolvedHost = 'localhost';
      url = `http://${resolvedHost}:${resolvedPort}`;
    }
    
    const message = [
      `Cypress MCP Server listening on ${url}`,
      'Put this in your client config:',
      JSON.stringify({
        'mcpServers': {
          'cypress': {
            'serverUrl': `${url}/sse`
          }
        }
      }, undefined, 2),
      'If your client supports streamable HTTP, you can use the /mcp endpoint instead.',
    ].join('\n');
    
    console.log(message);
  });
  
  // Handle server shutdown
  process.on('SIGINT', () => {
    console.log('Shutting down Cypress MCP Server...');
    httpServer.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
    
    // Close all active connections
    for (const connection of connectionList) {
      try {
        connection.close().catch((e: any) => {
          console.error('Error closing connection:', e);
        });
      } catch (error) {
        console.error('Error closing connection:', error);
      }
    }
    
    // Force exit after timeout
    setTimeout(() => {
      console.log('Force exiting...');
      process.exit(1);
    }, 3000);
  });
  
  return httpServer;
}
