/**
 * Copyright (c) 2024
 *
 * Licensed under the MIT License
 */
import { navigationTools } from './navigate.js';
import { elementTools } from './element.js';
import { assertionTools } from './assertions.js';
import { screenshotTools } from './screenshot.js';
import { waitTools } from './wait.js';
import { networkTools } from './network.js';
/**
 * Collection of all available tools
 */
export const tools = [
    ...navigationTools,
    ...elementTools,
    ...assertionTools,
    ...screenshotTools,
    ...waitTools,
    ...networkTools,
];
/**
 * Get all available tools
 */
export function getTools() {
    return tools;
}
/**
 * Get a tool by name
 */
export function getToolByName(name) {
    return tools.find(tool => tool.schema.name === name);
}
/**
 * Initialize tools with the Cypress instance
 */
export function initializeTools(cypressInstance) {
    // This function could be used to initialize tools with a Cypress instance
    // if needed in the future
    console.log('Cypress MCP tools initialized');
}
//# sourceMappingURL=index.js.map