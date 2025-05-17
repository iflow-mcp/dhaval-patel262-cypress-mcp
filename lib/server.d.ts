/**
 * Copyright (c) 2024
 *
 * Licensed under the MIT License
 */
import http from 'node:http';
/**
 * Start a transport using standard input/output
 */
export declare function startStdioTransport(options: {
    headless?: boolean;
    projectPath?: string;
    browser?: 'chrome' | 'firefox' | 'edge' | 'electron';
    detailedReports?: boolean;
}): Promise<void>;
/**
 * Start an HTTP transport server
 */
export declare function startHttpTransport(options: {
    headless?: boolean;
    projectPath?: string;
    browser?: 'chrome' | 'firefox' | 'edge' | 'electron';
    detailedReports?: boolean;
    port?: number;
    hostname?: string;
}): http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
