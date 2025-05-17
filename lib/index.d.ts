/**
 * Copyright (c) 2024
 *
 * Licensed under the MIT License
 */
import { Connection } from './connection.js';
import type { Config } from './config.js';
/**
 * Creates a connection to the MCP client
 * @param userConfig Optional user configuration
 * @returns A Promise resolving to a Connection instance
 */
export declare function createConnection(userConfig?: Config): Promise<Connection>;
