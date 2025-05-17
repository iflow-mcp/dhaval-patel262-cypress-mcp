/**
 * Copyright (c) 2024
 *
 * Licensed under the MIT License
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { Context } from './context.js';
import { registerTools } from './tools.js';
/**
 * Creates a connection to the MCP client
 * @param config Resolved configuration
 * @returns A Promise resolving to a Connection instance
 */
export async function createConnection(config) {
    // Get package.json version
    const packageJSON = { version: '0.0.1', name: '@cypress/mcp' };
    // Create context and get tools
    const context = new Context(config);
    const tools = registerTools(context);
    // Initialize MCP server
    const server = new Server({
        name: 'Cypress',
        version: packageJSON.version
    }, {
        capabilities: {
            tools: {},
        }
    });
    // Handle tool listing requests
    server.setRequestHandler(ListToolsRequestSchema, async () => {
        return {
            tools: tools.map(tool => ({
                name: tool.schema.name,
                description: tool.schema.description,
                inputSchema: zodToJsonSchema(tool.schema.inputSchema),
                annotations: {
                    title: tool.schema.title,
                    readOnlyHint: tool.schema.type === 'readOnly',
                    destructiveHint: tool.schema.type === 'destructive',
                    openWorldHint: true,
                },
            })),
        };
    });
    // Handle tool call requests
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const errorResult = (...messages) => ({
            content: [{ type: 'text', text: messages.join('\n') }],
            isError: true,
        });
        // Find requested tool
        const tool = tools.find(tool => tool.schema.name === request.params.name);
        if (!tool)
            return errorResult(`Tool "${request.params.name}" not found`);
        try {
            // Execute tool with the provided arguments
            return await context.runTool(tool, request.params.arguments);
        }
        catch (error) {
            return errorResult(String(error));
        }
    });
    // Return connection
    const connection = new Connection(server, context);
    return connection;
}
/**
 * Connection class for managing the MCP connection
 */
export class Connection {
    server;
    context;
    constructor(server, context) {
        this.server = server;
        this.context = context;
    }
    /**
     * Connect to the MCP client
     * @param transport MCP transport
     */
    async connect(transport) {
        await this.server.connect(transport);
        await new Promise(resolve => {
            this.server.oninitialized = () => resolve();
        });
    }
    /**
     * Close the connection and clean up resources
     */
    async close() {
        await this.server.close();
        await this.context.close();
    }
}
//# sourceMappingURL=connection.js.map