/**
 * Copyright (c) 2024
 *
 * Licensed under the MIT License
 */
import { createConnection as createConnectionImpl } from './connection.js';
import { resolveConfig } from './config.js';
/**
 * Creates a connection to the MCP client
 * @param userConfig Optional user configuration
 * @returns A Promise resolving to a Connection instance
 */
export async function createConnection(userConfig = {}) {
    const config = await resolveConfig(userConfig);
    return createConnectionImpl(config);
}
//# sourceMappingURL=index.js.map