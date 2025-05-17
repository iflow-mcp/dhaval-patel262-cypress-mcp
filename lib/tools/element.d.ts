/**
 * Copyright (c) 2024
 *
 * Licensed under the MIT License
 */
/**
 * Element interaction tools for Cypress
 */
/**
 * Click on an element
 */
export declare const click: import("./tool.js").Tool<{
    selector: string;
    force?: boolean | undefined;
}>;
/**
 * Double-click on an element
 */
export declare const doubleClick: import("./tool.js").Tool<{
    selector: string;
    force?: boolean | undefined;
}>;
/**
 * Type text into an element
 */
export declare const typeText: import("./tool.js").Tool<{
    text: string;
    selector: string;
    clear?: boolean | undefined;
}>;
/**
 * Get element text
 */
export declare const getText: import("./tool.js").Tool<{
    selector: string;
}>;
/**
 * Check if element exists
 */
export declare const elementExists: import("./tool.js").Tool<{
    selector: string;
}>;
/**
 * Export all element interaction tools
 */
export declare const elementTools: (import("./tool.js").Tool<{
    selector: string;
    force?: boolean | undefined;
}> | import("./tool.js").Tool<{
    text: string;
    selector: string;
    clear?: boolean | undefined;
}> | import("./tool.js").Tool<{
    selector: string;
}>)[];
