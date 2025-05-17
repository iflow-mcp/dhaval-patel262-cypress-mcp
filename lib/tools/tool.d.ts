/**
 * Copyright (c) 2024
 *
 * Licensed under the MIT License
 */
import { z } from 'zod';
import type { Context } from '../context.js';
/**
 * Tool response content
 */
export type ToolResponseContent = {
    type: 'text';
    text: string;
} | {
    type: 'code';
    code: string;
    language: string;
} | {
    type: 'html';
    html: string;
} | {
    type: 'image';
    mimeType: string;
    data: string;
};
/**
 * Tool handler result
 */
export interface ToolResult {
    /** Content to return to the MCP client */
    content: ToolResponseContent[] | string;
    /** Whether the result represents an error */
    isError?: boolean;
    /** Additional metadata */
    metadata?: Record<string, any>;
}
/**
 * Tool handler function
 */
export type ToolHandler<T> = (context: Context, params: T) => Promise<ToolResult>;
/**
 * Tool definition
 */
export interface ToolDefinition<T> {
    /** Tool capability category */
    capability: string;
    /** Tool schema */
    schema: {
        /** Tool name (used by MCP client to identify the tool) */
        name: string;
        /** Human-readable title */
        title: string;
        /** Tool description */
        description: string;
        /** Input schema (using Zod) */
        inputSchema: z.ZodType<T>;
        /** Tool type (readOnly or destructive) */
        type: 'readOnly' | 'destructive';
    };
}
/**
 * Complete tool definition with handler
 */
export interface Tool<T> extends ToolDefinition<T> {
    /** Tool handler function */
    handle: ToolHandler<T>;
}
/**
 * Define a tool
 * @param definition Tool definition
 * @param handler Tool handler
 * @returns Complete tool
 */
export declare function defineTool<T>(definition: ToolDefinition<T>, handler: ToolHandler<T>): Tool<T>;
