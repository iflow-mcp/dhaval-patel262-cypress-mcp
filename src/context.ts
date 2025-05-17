/**
 * Copyright (c) 2024
 *
 * Licensed under the MIT License
 */

import * as fs from 'fs';
import * as path from 'path';
import type { FullConfig } from './config.js';
import type { Tool } from './tools/tool.js';

/**
 * Context class for managing Cypress MCP state
 */
export class Context {
  readonly config: FullConfig;
  private cypressInstance: Record<string, unknown> | null = null;
  private readonly testFiles: Map<string, string> = new Map();
  private readonly testResults: Map<string, Record<string, unknown>> = new Map();
  private currentTestScenario: string | null = null;
  private currentTestCase: string | null = null;
  
  // Store parsing results for scenarios
  private readonly parsingResults: Map<string, Array<Record<string, unknown>>> = new Map();
  
  // Store generated test files keyed by test name
  private readonly generatedTests: Map<string, string> = new Map();
  
  // Store screenshots and artifacts
  private readonly screenshots: Map<string, string> = new Map();
  private readonly artifacts: Map<string, Record<string, unknown>> = new Map();
  
  constructor(config: FullConfig) {
    this.config = config;
  }
  
  /**
   * Run a tool with the provided arguments
   * @param tool Tool to run
   * @param args Tool arguments
   * @returns Response to be sent to the MCP client
   */
  async runTool<T>(tool: Tool<T>, args: T): Promise<{ content: unknown; isError: boolean }> {
    // Validate arguments against the tool's schema
    try {
      const validatedArgs = tool.schema.inputSchema.parse(args);
      
      // Run the tool handler
      const result = await tool.handle(this, validatedArgs);
      
      // Format the response
      return {
        content: Array.isArray(result.content) 
          ? result.content 
          : [{ type: 'text', text: String(result.content) }],
        isError: result.isError || false,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [{ type: 'text', text: `Error: ${errorMessage}` }],
        isError: true,
      };
    }
  }
  
  /**
   * Get the path to the Cypress project
   */
  getProjectPath(): string {
    return this.config.projectPath;
  }
  
  /**
   * Save a generated test file
   * @param name Test file name
   * @param content Test file content
   */
  saveTestFile(name: string, content: string): void {
    this.testFiles.set(name, content);
    
    // Save to disk
    const testPath = path.join(this.config.projectPath, 'cypress', 'e2e', name);
    fs.mkdirSync(path.dirname(testPath), { recursive: true });
    fs.writeFileSync(testPath, content, 'utf-8');
  }
  
  /**
   * Get a test file by name
   * @param name Test file name
   */
  getTestFile(name: string): string | undefined {
    return this.testFiles.get(name);
  }
  
  /**
   * Set the current test scenario
   * @param scenario Test scenario description
   */
  setCurrentTestScenario(scenario: string): void {
    this.currentTestScenario = scenario;
  }
  
  /**
   * Get the current test scenario
   */
  getCurrentTestScenario(): string | null {
    return this.currentTestScenario;
  }
  
  /**
   * Set the current test case
   * @param testCase Test case name
   */
  setCurrentTestCase(testCase: string): void {
    this.currentTestCase = testCase;
  }
  
  /**
   * Get the current test case
   */
  getCurrentTestCase(): string | null {
    return this.currentTestCase;
  }
  
  /**
   * Store parsed test scenario results
   * @param scenario Test scenario description
   * @param steps Parsed steps from the scenario
   */
  storeParsingResult(scenario: string, steps: Array<Record<string, unknown>>): void {
    this.parsingResults.set(scenario, steps);
  }
  
  /**
   * Get parsed steps for a scenario
   * @param scenario Test scenario description
   * @returns Parsed steps or undefined
   */
  getParsingResult(scenario: string): Array<Record<string, unknown>> | undefined {
    return this.parsingResults.get(scenario);
  }
  
  /**
   * Store a generated test with its source code
   * @param testName Test name
   * @param sourceCode Generated test source code
   */
  storeGeneratedTest(testName: string, sourceCode: string): void {
    this.generatedTests.set(testName, sourceCode);
  }
  
  /**
   * Get a generated test by name
   * @param testName Test name
   * @returns Test source code or undefined
   */
  getGeneratedTest(testName: string): string | undefined {
    return this.generatedTests.get(testName);
  }
  
  /**
   * Store test results
   * @param testName Test name
   * @param results Test results
   */
  saveTestResults(testName: string, results: Record<string, unknown>): void {
    this.testResults.set(testName, results);
  }
  
  /**
   * Store a screenshot
   * @param name Screenshot name
   * @param path Path to the screenshot file
   */
  saveScreenshot(name: string, path: string): void {
    this.screenshots.set(name, path);
  }
  
  /**
   * Get a screenshot by name
   * @param name Screenshot name
   * @returns Path to the screenshot or undefined
   */
  getScreenshot(name: string): string | undefined {
    return this.screenshots.get(name);
  }
  
  /**
   * Store an artifact
   * @param name Artifact name
   * @param data Artifact data
   */
  saveArtifact(name: string, data: Record<string, unknown>): void {
    this.artifacts.set(name, data);
  }
  
  /**
   * Get an artifact by name
   * @param name Artifact name
   * @returns Artifact data or undefined
   */
  getArtifact(name: string): Record<string, unknown> | undefined {
    return this.artifacts.get(name);
  }
  
  /**
   * Get test results
   * @param testName Test name
   */
  getTestResults(testName: string): Record<string, unknown> | undefined {
    return this.testResults.get(testName);
  }
  
  /**
   * Close and clean up resources
   */
  async close(): Promise<void> {
    // Clean up any Cypress instances
    if (this.cypressInstance) {
      // Additional cleanup logic here
      this.cypressInstance = null;
    }
  }
}
