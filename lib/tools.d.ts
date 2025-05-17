/**
 * Copyright (c) 2024
 *
 * Licensed under the MIT License
 */
import type { Tool } from './tools/tool.js';
import type { Context } from './context.js';
/**
 * Register all tools for the Cypress MCP server
 * @param context Context instance
 * @returns Array of registered tools
 */
export declare function registerTools(context: Context): Tool<any>[];
