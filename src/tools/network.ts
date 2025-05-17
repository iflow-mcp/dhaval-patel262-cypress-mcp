/**
 * Copyright (c) 2024
 *
 * Licensed under the MIT License
 */

import { z } from 'zod';
import { defineTool } from './tool.js';
import type { Context } from '../context.js';

/**
 * Network interception tools for Cypress
 */

/**
 * Intercept a network request
 */
export const interceptRequest = defineTool(
  {
    capability: 'network',
    schema: {
      name: 'cypress_intercept_request',
      title: 'Intercept Request',
      description: 'Intercept a network request for monitoring or modification',
      inputSchema: z.object({
        url: z.string().describe('URL pattern to match for interception'),
        method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS', '*']).optional().describe('HTTP method to intercept'),
        alias: z.string().optional().describe('Alias to use for the intercepted request'),
      }),
      type: 'destructive',
    }
  },
  async (context: Context, params) => {
    const { url, method, alias } = params;
    const aliasName = alias ?? `req_${Date.now()}`;
    let code: string[];
    
    if (method && method !== '*') {
      code = [
        `// Intercept ${method} request to "${url}"`,
        `cy.intercept('${method}', '${url}').as('${aliasName}');`,
        `// You can wait for this request later using:`,
        `// cy.wait('@${aliasName}');`,
      ];
    } else {
      code = [
        `// Intercept any request to "${url}"`,
        `cy.intercept('${url}').as('${aliasName}');`,
        `// You can wait for this request later using:`,
        `// cy.wait('@${aliasName}');`,
      ];
    }
    
    return {
      content: [
        { 
          type: 'text', 
          text: `Intercepting ${method ?? 'any'} request to "${url}" with alias "${aliasName}"`
        },
        { 
          type: 'code', 
          code: code.join('\n'), 
          language: 'javascript' 
        }
      ]
    };
  }
);

/**
 * Mock a network response
 */
export const mockResponse = defineTool(
  {
    capability: 'network',
    schema: {
      name: 'cypress_mock_response',
      title: 'Mock Response',
      description: 'Mock a response for a network request',
      inputSchema: z.object({
        url: z.string().describe('URL pattern to match for mocking'),
        method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS', '*']).optional().describe('HTTP method to mock'),
        statusCode: z.number().describe('HTTP status code to return'),
        body: z.string().describe('JSON body to return as string'),
        alias: z.string().optional().describe('Alias to use for the mocked request'),
      }),
      type: 'destructive',
    }
  },
  async (context: Context, params) => {
    const { url, method, statusCode, body, alias } = params;
    const aliasName = alias ?? `mock_${Date.now()}`;
    let code: string[];
    
    if (method && method !== '*') {
      code = [
        `// Mock ${method} request to "${url}" with status ${statusCode}`,
        `cy.intercept('${method}', '${url}', {`,
        `  statusCode: ${statusCode},`,
        `  body: ${body}`,
        `}).as('${aliasName}');`,
        `// You can wait for this request later using:`,
        `// cy.wait('@${aliasName}');`,
      ];
    } else {
      code = [
        `// Mock any request to "${url}" with status ${statusCode}`,
        `cy.intercept('${url}', {`,
        `  statusCode: ${statusCode},`,
        `  body: ${body}`,
        `}).as('${aliasName}');`,
        `// You can wait for this request later using:`,
        `// cy.wait('@${aliasName}');`,
      ];
    }
    
    return {
      content: [
        { 
          type: 'text', 
          text: `Mocking ${method ?? 'any'} request to "${url}" with status ${statusCode} and alias "${aliasName}"`
        },
        { 
          type: 'code', 
          code: code.join('\n'), 
          language: 'javascript' 
        }
      ]
    };
  }
);

/**
 * Block network requests
 */
export const blockRequests = defineTool(
  {
    capability: 'network',
    schema: {
      name: 'cypress_block_requests',
      title: 'Block Requests',
      description: 'Block matching network requests',
      inputSchema: z.object({
        url: z.string().describe('URL pattern to match for blocking'),
        method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS', '*']).optional().describe('HTTP method to block'),
      }),
      type: 'destructive',
    }
  },
  async (context: Context, params) => {
    const { url, method } = params;
    let code: string[];
    
    if (method && method !== '*') {
      code = [
        `// Block ${method} requests to "${url}"`,
        `cy.intercept('${method}', '${url}', (req) => {`,
        `  req.destroy();`,
        `});`,
      ];
    } else {
      code = [
        `// Block any requests to "${url}"`,
        `cy.intercept('${url}', (req) => {`,
        `  req.destroy();`,
        `});`,
      ];
    }
    
    return {
      content: [
        { 
          type: 'text', 
          text: `Blocking ${method ?? 'any'} requests to "${url}"`
        },
        { 
          type: 'code', 
          code: code.join('\n'), 
          language: 'javascript' 
        }
      ]
    };
  }
);

/**
 * Export all network tools
 */
export const networkTools = [
  interceptRequest,
  mockResponse,
  blockRequests,
];
