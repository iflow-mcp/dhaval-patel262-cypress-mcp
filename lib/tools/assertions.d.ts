/**
 * Copyright (c) 2024
 *
 * Licensed under the MIT License
 */
/**
 * Assertion tools for Cypress
 */
/**
 * Assert element content
 */
export declare const assertText: import("./tool.js").Tool<{
    text: string;
    selector: string;
    exact?: boolean | undefined;
}>;
/**
 * Assert element visibility
 */
export declare const assertVisible: import("./tool.js").Tool<{
    selector: string;
    negated?: boolean | undefined;
}>;
/**
 * Assert element attribute
 */
export declare const assertAttribute: import("./tool.js").Tool<{
    value: string;
    selector: string;
    attribute: string;
}>;
/**
 * Assert URL
 */
export declare const assertUrl: import("./tool.js").Tool<{
    url: string;
    exact?: boolean | undefined;
}>;
/**
 * Assert element count
 */
export declare const assertCount: import("./tool.js").Tool<{
    selector: string;
    count: number;
}>;
/**
 * Export all assertion tools
 */
export declare const assertionTools: (import("./tool.js").Tool<{
    text: string;
    selector: string;
    exact?: boolean | undefined;
}> | import("./tool.js").Tool<{
    selector: string;
    negated?: boolean | undefined;
}> | import("./tool.js").Tool<{
    value: string;
    selector: string;
    attribute: string;
}> | import("./tool.js").Tool<{
    url: string;
    exact?: boolean | undefined;
}> | import("./tool.js").Tool<{
    selector: string;
    count: number;
}>)[];
