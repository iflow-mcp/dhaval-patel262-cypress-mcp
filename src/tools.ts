/**
 * Copyright (c) 2024
 *
 * Licensed under the MIT License
 */

// Import original tool groups
import parseTools from './tools/parse.js';
import generateTools from './tools/generate.js';
import executeTools from './tools/execute.js';
import reportTools from './tools/report.js';

// Import new Cypress tools matching Playwright MCP functionality
import { navigationTools } from './tools/navigate.js';
import { elementTools } from './tools/element.js';
import { assertionTools } from './tools/assertions.js';
import { screenshotTools } from './tools/screenshot.js';
import { waitTools } from './tools/wait.js';
import { networkTools } from './tools/network.js';

import type { Tool } from './tools/tool.js';
import type { Context } from './context.js';

/**
 * Register all tools for the Cypress MCP server
 * @param context Context instance
 * @returns Array of registered tools
 */
export function registerTools(context: Context): Tool<any>[] {
  return [
    // Original Cypress MCP tools
    ...parseTools(context),
    ...generateTools(context),
    ...executeTools(context),
    ...reportTools(context),
    
    // New Cypress tools matching Playwright MCP functionality
    ...navigationTools,
    ...elementTools,
    ...assertionTools,
    ...screenshotTools,
    ...waitTools,
    ...networkTools,
  ];
}
