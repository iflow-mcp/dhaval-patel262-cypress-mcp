/**
 * Copyright (c) 2024
 *
 * Licensed under the MIT License
 */
import type { FullConfig } from './config.js';
import type { Tool } from './tools/tool.js';
/**
 * Context class for managing Cypress MCP state
 */
export declare class Context {
    readonly config: FullConfig;
    private cypressInstance;
    private readonly testFiles;
    private readonly testResults;
    private currentTestScenario;
    private currentTestCase;
    private readonly parsingResults;
    private readonly generatedTests;
    private readonly screenshots;
    private readonly artifacts;
    constructor(config: FullConfig);
    /**
     * Run a tool with the provided arguments
     * @param tool Tool to run
     * @param args Tool arguments
     * @returns Response to be sent to the MCP client
     */
    runTool<T>(tool: Tool<T>, args: T): Promise<{
        content: unknown;
        isError: boolean;
    }>;
    /**
     * Get the path to the Cypress project
     */
    getProjectPath(): string;
    /**
     * Save a generated test file
     * @param name Test file name
     * @param content Test file content
     */
    saveTestFile(name: string, content: string): void;
    /**
     * Get a test file by name
     * @param name Test file name
     */
    getTestFile(name: string): string | undefined;
    /**
     * Set the current test scenario
     * @param scenario Test scenario description
     */
    setCurrentTestScenario(scenario: string): void;
    /**
     * Get the current test scenario
     */
    getCurrentTestScenario(): string | null;
    /**
     * Set the current test case
     * @param testCase Test case name
     */
    setCurrentTestCase(testCase: string): void;
    /**
     * Get the current test case
     */
    getCurrentTestCase(): string | null;
    /**
     * Store parsed test scenario results
     * @param scenario Test scenario description
     * @param steps Parsed steps from the scenario
     */
    storeParsingResult(scenario: string, steps: Array<Record<string, unknown>>): void;
    /**
     * Get parsed steps for a scenario
     * @param scenario Test scenario description
     * @returns Parsed steps or undefined
     */
    getParsingResult(scenario: string): Array<Record<string, unknown>> | undefined;
    /**
     * Store a generated test with its source code
     * @param testName Test name
     * @param sourceCode Generated test source code
     */
    storeGeneratedTest(testName: string, sourceCode: string): void;
    /**
     * Get a generated test by name
     * @param testName Test name
     * @returns Test source code or undefined
     */
    getGeneratedTest(testName: string): string | undefined;
    /**
     * Store test results
     * @param testName Test name
     * @param results Test results
     */
    saveTestResults(testName: string, results: Record<string, unknown>): void;
    /**
     * Store a screenshot
     * @param name Screenshot name
     * @param path Path to the screenshot file
     */
    saveScreenshot(name: string, path: string): void;
    /**
     * Get a screenshot by name
     * @param name Screenshot name
     * @returns Path to the screenshot or undefined
     */
    getScreenshot(name: string): string | undefined;
    /**
     * Store an artifact
     * @param name Artifact name
     * @param data Artifact data
     */
    saveArtifact(name: string, data: Record<string, unknown>): void;
    /**
     * Get an artifact by name
     * @param name Artifact name
     * @returns Artifact data or undefined
     */
    getArtifact(name: string): Record<string, unknown> | undefined;
    /**
     * Get test results
     * @param testName Test name
     */
    getTestResults(testName: string): Record<string, unknown> | undefined;
    /**
     * Close and clean up resources
     */
    close(): Promise<void>;
}
