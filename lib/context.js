/**
 * Copyright (c) 2024
 *
 * Licensed under the MIT License
 */
import * as fs from 'fs';
import * as path from 'path';
/**
 * Context class for managing Cypress MCP state
 */
export class Context {
    config;
    cypressInstance = null;
    testFiles = new Map();
    testResults = new Map();
    currentTestScenario = null;
    currentTestCase = null;
    // Store parsing results for scenarios
    parsingResults = new Map();
    // Store generated test files keyed by test name
    generatedTests = new Map();
    // Store screenshots and artifacts
    screenshots = new Map();
    artifacts = new Map();
    constructor(config) {
        this.config = config;
    }
    /**
     * Run a tool with the provided arguments
     * @param tool Tool to run
     * @param args Tool arguments
     * @returns Response to be sent to the MCP client
     */
    async runTool(tool, args) {
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
        }
        catch (error) {
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
    getProjectPath() {
        return this.config.projectPath;
    }
    /**
     * Save a generated test file
     * @param name Test file name
     * @param content Test file content
     */
    saveTestFile(name, content) {
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
    getTestFile(name) {
        return this.testFiles.get(name);
    }
    /**
     * Set the current test scenario
     * @param scenario Test scenario description
     */
    setCurrentTestScenario(scenario) {
        this.currentTestScenario = scenario;
    }
    /**
     * Get the current test scenario
     */
    getCurrentTestScenario() {
        return this.currentTestScenario;
    }
    /**
     * Set the current test case
     * @param testCase Test case name
     */
    setCurrentTestCase(testCase) {
        this.currentTestCase = testCase;
    }
    /**
     * Get the current test case
     */
    getCurrentTestCase() {
        return this.currentTestCase;
    }
    /**
     * Store parsed test scenario results
     * @param scenario Test scenario description
     * @param steps Parsed steps from the scenario
     */
    storeParsingResult(scenario, steps) {
        this.parsingResults.set(scenario, steps);
    }
    /**
     * Get parsed steps for a scenario
     * @param scenario Test scenario description
     * @returns Parsed steps or undefined
     */
    getParsingResult(scenario) {
        return this.parsingResults.get(scenario);
    }
    /**
     * Store a generated test with its source code
     * @param testName Test name
     * @param sourceCode Generated test source code
     */
    storeGeneratedTest(testName, sourceCode) {
        this.generatedTests.set(testName, sourceCode);
    }
    /**
     * Get a generated test by name
     * @param testName Test name
     * @returns Test source code or undefined
     */
    getGeneratedTest(testName) {
        return this.generatedTests.get(testName);
    }
    /**
     * Store test results
     * @param testName Test name
     * @param results Test results
     */
    saveTestResults(testName, results) {
        this.testResults.set(testName, results);
    }
    /**
     * Store a screenshot
     * @param name Screenshot name
     * @param path Path to the screenshot file
     */
    saveScreenshot(name, path) {
        this.screenshots.set(name, path);
    }
    /**
     * Get a screenshot by name
     * @param name Screenshot name
     * @returns Path to the screenshot or undefined
     */
    getScreenshot(name) {
        return this.screenshots.get(name);
    }
    /**
     * Store an artifact
     * @param name Artifact name
     * @param data Artifact data
     */
    saveArtifact(name, data) {
        this.artifacts.set(name, data);
    }
    /**
     * Get an artifact by name
     * @param name Artifact name
     * @returns Artifact data or undefined
     */
    getArtifact(name) {
        return this.artifacts.get(name);
    }
    /**
     * Get test results
     * @param testName Test name
     */
    getTestResults(testName) {
        return this.testResults.get(testName);
    }
    /**
     * Close and clean up resources
     */
    async close() {
        // Clean up any Cypress instances
        if (this.cypressInstance) {
            // Additional cleanup logic here
            this.cypressInstance = null;
        }
    }
}
//# sourceMappingURL=context.js.map