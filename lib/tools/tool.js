/**
 * Copyright (c) 2024
 *
 * Licensed under the MIT License
 */
/**
 * Define a tool
 * @param definition Tool definition
 * @param handler Tool handler
 * @returns Complete tool
 */
export function defineTool(definition, handler) {
    return {
        ...definition,
        handle: handler,
    };
}
//# sourceMappingURL=tool.js.map