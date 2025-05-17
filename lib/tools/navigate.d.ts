/**
 * Copyright (c) 2024
 *
 * Licensed under the MIT License
 */
/**
 * Navigation tools for Cypress
 */
/**
 * Navigate to a URL
 */
export declare const navigate: import("./tool.js").Tool<{
    url: string;
}>;
/**
 * Go back in browser history
 */
export declare const goBack: import("./tool.js").Tool<{}>;
/**
 * Go forward in browser history
 */
export declare const goForward: import("./tool.js").Tool<{}>;
/**
 * Reload the page
 */
export declare const reload: import("./tool.js").Tool<{}>;
/**
 * Export all navigation tools
 */
export declare const navigationTools: (import("./tool.js").Tool<{
    url: string;
}> | import("./tool.js").Tool<{}>)[];
