/**
 * Copyright (c) 2024
 *
 * Licensed under the MIT License
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { Context } from './context.js';
interface Transport {
    start(): Promise<void>;
    send(message: any, options?: any): Promise<void>;
    close(): Promise<void>;
}
import type { FullConfig } from './config.js';
/**
 * Creates a connection to the MCP client
 * @param config Resolved configuration
 * @returns A Promise resolving to a Connection instance
 */
export declare function createConnection(config: FullConfig): Promise<Connection>;
/**
 * Connection class for managing the MCP connection
 */
export declare class Connection {
    readonly server: Server;
    readonly context: Context;
    constructor(server: Server, context: Context);
    /**
     * Connect to the MCP client
     * @param transport MCP transport
     */
    connect(transport: Transport): Promise<void>;
    /**
     * Close the connection and clean up resources
     */
    close(): Promise<void>;
}
export {};
