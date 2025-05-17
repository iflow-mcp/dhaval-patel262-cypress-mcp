/**
 * Copyright (c) 2024
 *
 * Licensed under the MIT License
 */

/**
 * Configuration options for the Cypress MCP server
 */
export interface Config {
  /**
   * Path to Cypress project or config file
   */
  projectPath?: string;
  
  /**
   * List of capabilities to enable
   */
  capabilities?: string[];
  
  /**
   * Whether to use headless mode
   */
  headless?: boolean;
  
  /**
   * Whether to generate detailed reports
   */
  detailedReports?: boolean;
  
  /**
   * Browser to use for testing
   */
  browser?: 'chrome' | 'firefox' | 'edge' | 'electron';
}

/**
 * Full configuration with resolved values
 */
export interface FullConfig extends Config {
  projectPath: string;
  capabilities: string[];
  headless: boolean;
  detailedReports: boolean;
  browser: 'chrome' | 'firefox' | 'edge' | 'electron';
}

/**
 * Resolves configuration with defaults
 * @param config User-provided configuration
 * @returns Fully resolved configuration
 */
export async function resolveConfig(config: Config): Promise<FullConfig> {
  return {
    projectPath: config.projectPath || process.cwd(),
    capabilities: config.capabilities || ['core', 'testing', 'generation'],
    headless: config.headless !== undefined ? config.headless : true,
    detailedReports: config.detailedReports !== undefined ? config.detailedReports : true,
    browser: config.browser || 'chrome'
  };
}
