/**
 * Copyright (c) 2024
 *
 * Licensed under the MIT License
 */
/**
 * Network interception tools for Cypress
 */
/**
 * Intercept a network request
 */
export declare const interceptRequest: import("./tool.js").Tool<{
    url: string;
    method?: "POST" | "GET" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS" | "*" | undefined;
    alias?: string | undefined;
}>;
/**
 * Mock a network response
 */
export declare const mockResponse: import("./tool.js").Tool<{
    url: string;
    statusCode: number;
    body: string;
    method?: "POST" | "GET" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS" | "*" | undefined;
    alias?: string | undefined;
}>;
/**
 * Block network requests
 */
export declare const blockRequests: import("./tool.js").Tool<{
    url: string;
    method?: "POST" | "GET" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS" | "*" | undefined;
}>;
/**
 * Export all network tools
 */
export declare const networkTools: (import("./tool.js").Tool<{
    url: string;
    method?: "POST" | "GET" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS" | "*" | undefined;
    alias?: string | undefined;
}> | import("./tool.js").Tool<{
    url: string;
    statusCode: number;
    body: string;
    method?: "POST" | "GET" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS" | "*" | undefined;
    alias?: string | undefined;
}> | import("./tool.js").Tool<{
    url: string;
    method?: "POST" | "GET" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS" | "*" | undefined;
}>)[];
