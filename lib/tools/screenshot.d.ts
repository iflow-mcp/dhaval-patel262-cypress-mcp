/**
 * Copyright (c) 2024
 *
 * Licensed under the MIT License
 */
/**
 * Screenshot tools for Cypress
 */
/**
 * Take a screenshot of the page
 */
export declare const takeScreenshot: import("./tool.js").Tool<{
    name?: string | undefined;
}>;
/**
 * Take a screenshot of a specific element
 */
export declare const takeElementScreenshot: import("./tool.js").Tool<{
    selector: string;
    name?: string | undefined;
}>;
/**
 * Export all screenshot tools
 */
export declare const screenshotTools: (import("./tool.js").Tool<{
    name?: string | undefined;
}> | import("./tool.js").Tool<{
    selector: string;
    name?: string | undefined;
}>)[];
