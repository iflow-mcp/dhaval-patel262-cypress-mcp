/**
 * Copyright (c) 2024
 *
 * Licensed under the MIT License
 */
/**
 * Resolves configuration with defaults
 * @param config User-provided configuration
 * @returns Fully resolved configuration
 */
export async function resolveConfig(config) {
    return {
        projectPath: config.projectPath || process.cwd(),
        capabilities: config.capabilities || ['core', 'testing', 'generation'],
        headless: config.headless !== undefined ? config.headless : true,
        detailedReports: config.detailedReports !== undefined ? config.detailedReports : true,
        browser: config.browser || 'chrome'
    };
}
//# sourceMappingURL=config.js.map