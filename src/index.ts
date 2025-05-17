/**
 * Copyright (c) 2024
 *
 * Licensed under the MIT License
 */

import { Connection, createConnection as createConnectionImpl } from './connection.js';
import { resolveConfig } from './config.js';

import type { Config } from './config.js';

/**
 * Creates a connection to the MCP client
 * @param userConfig Optional user configuration
 * @returns A Promise resolving to a Connection instance
 */
export async function createConnection(userConfig: Config = {}): Promise<Connection> {
  const config = await resolveConfig(userConfig);
  return createConnectionImpl(config);
}
