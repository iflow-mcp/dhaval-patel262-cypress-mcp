/**
 * Copyright (c) 2024
 *
 * Licensed under the MIT License
 */
/**
 * Waiting tools for Cypress
 */
/**
 * Wait for an element
 */
export declare const waitForElement: import("./tool.js").Tool<{
    selector: string;
    state: "exist" | "visible" | "enabled" | "disabled";
    timeout?: number | undefined;
}>;
/**
 * Wait for page load
 */
export declare const waitForPageLoad: import("./tool.js").Tool<{
    timeout?: number | undefined;
}>;
/**
 * Wait for a fixed time
 */
export declare const waitForTime: import("./tool.js").Tool<{
    time: number;
}>;
/**
 * Wait for a network request to complete
 */
export declare const waitForRequest: import("./tool.js").Tool<{
    url: string;
    timeout?: number | undefined;
    alias?: string | undefined;
}>;
/**
 * Export all waiting tools
 */
export declare const waitTools: (import("./tool.js").Tool<{
    selector: string;
    state: "exist" | "visible" | "enabled" | "disabled";
    timeout?: number | undefined;
}> | import("./tool.js").Tool<{
    timeout?: number | undefined;
}> | import("./tool.js").Tool<{
    time: number;
}> | import("./tool.js").Tool<{
    url: string;
    timeout?: number | undefined;
    alias?: string | undefined;
}>)[];
