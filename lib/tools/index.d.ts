/**
 * Copyright (c) 2024
 *
 * Licensed under the MIT License
 */
import type { Tool } from './tool.js';
/**
 * Collection of all available tools
 */
export declare const tools: Tool<any>[];
/**
 * Get all available tools
 */
export declare function getTools(): Tool<any>[];
/**
 * Get a tool by name
 */
export declare function getToolByName(name: string): Tool<any> | undefined;
/**
 * Initialize tools with the Cypress instance
 */
export declare function initializeTools(cypressInstance: any): void;
