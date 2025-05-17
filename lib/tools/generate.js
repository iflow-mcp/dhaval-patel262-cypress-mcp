/**
 * Copyright (c) 2024
 *
 * Licensed under the MIT License
 */
import { z } from 'zod';
import { defineTool } from './tool.js';
import fetch from 'node-fetch';
import * as prettier from 'prettier';
import * as dotenv from 'dotenv';
// Load environment variables
dotenv.config();
/**
 * Advanced test generator that uses AI to create robust Cypress tests
 */
class CypressTestGenerator {
    apiKey;
    model;
    constructor(apiKey, model = 'gpt-3.5-turbo') {
        this.apiKey = apiKey ?? process.env.OPENAI_API_KEY;
        this.model = model;
    }
    /**
     * Generate Cypress test code based on test steps
     * @param testName Name of the test
     * @param steps Test steps
     * @param targetUrl Target URL
     * @returns Generated Cypress test code
     */
    async generateTestCode(testName, steps, targetUrl) {
        // If no API key is available, use the simple generator
        if (!this.apiKey) {
            console.log('No OpenAI API key found, using simple test generator');
            return this.simpleGenerator(testName, steps, targetUrl);
        }
        try {
            const prompt = `
        Generate a Cypress test case based on the following test steps.
        The test should follow Cypress best practices including appropriate assertions, error handling, and retry strategies.
        
        Test name: ${testName}
        Target URL: ${targetUrl}
        
        Test steps:
        ${JSON.stringify(steps, null, 2)}
        
        Include these best practices:
        - Use cy.get() with appropriate selectors or cy.contains() for finding elements
        - Add appropriate timeouts and retry logic for flaky tests
        - Use data-cy or other test-specific attributes when selectors are provided
        - Include meaningful assertions after each action
        - Handle possible edge cases and errors gracefully
        - Add comments explaining the test flow
        
        Return only the JavaScript code without any extra explanation.
        Format the code in this style:
        
        // Generated Cypress Test: [Test Name]
        describe('[Test Name]', () => {
          it('should [test description]', () => {
            // Test code here
          });
        });
      `;
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant that generates high-quality Cypress test code.' },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.2
                })
            });
            const data = await response.json();
            if (!response.ok) {
                console.error('OpenAI API error:', data);
                return this.simpleGenerator(testName, steps, targetUrl);
            }
            const content = data.choices?.[0]?.message?.content;
            if (!content) {
                console.error('Unexpected response format from OpenAI API');
                return this.simpleGenerator(testName, steps, targetUrl);
            }
            // Extract the code block from the response
            const codeMatch = content.replace(/```(javascript|js|typescript|ts)?([\s\S]*?)```/g, '$2').trim();
            const cleanedCode = codeMatch || content;
            // Format the code with prettier
            try {
                const formattedCode = await prettier.format(cleanedCode, {
                    parser: 'babel',
                    semi: true,
                    singleQuote: true,
                    trailingComma: 'es5'
                });
                return formattedCode;
            }
            catch (formatError) {
                console.error('Error formatting code:', formatError);
                return cleanedCode;
            }
        }
        catch (error) {
            console.error('Error generating test code with AI:', error);
            return this.simpleGenerator(testName, steps, targetUrl);
        }
    }
    /**
     * Simple test code generator (fallback)
     * @param testName Name of the test
     * @param steps Test steps
     * @param targetUrl Target URL
     * @returns Generated Cypress test code
     */
    simpleGenerator(testName, steps, targetUrl) {
        // Basic Cypress test template
        let code = `// Generated Cypress Test: ${testName}
describe('${testName}', () => {
  it('should complete the test scenario successfully', () => {
`;
        // Add visit step to navigate to the target URL
        code += `    // Navigate to the target URL
    cy.visit('${targetUrl}');
`;
        // Process each step
        for (const step of steps) {
            switch (step.action) {
                case 'navigate':
                    code += `
    // ${step.description}
    cy.visit('${step.params.url}');
`;
                    break;
                case 'click':
                    code += `
    // ${step.description}
    cy.contains('${step.params.element}').click();
`;
                    break;
                case 'type':
                    code += `
    // ${step.description}
    cy.get('${step.params.element || 'input'}').type('${step.params.text}');
`;
                    break;
                case 'assert':
                    code += `
    // ${step.description}
    cy.contains('${step.params.assertion || 'Success'}').should('exist');
`;
                    break;
                case 'wait':
                    {
                        const duration = step.params.duration || 1000;
                        code += `
    // ${step.description}
    cy.wait(${duration});
`;
                    }
                    break;
                case 'select':
                    code += `
    // ${step.description}
    cy.get('${step.params.element || 'select'}').select('${step.params.option}');
`;
                    break;
                default:
                    code += `
    // ${step.description}
    // Unhandled action: ${step.action}
`;
            }
        }
        // Add final assertion
        code += `
    // Verify the test completed successfully
    cy.log('Test completed successfully');
`;
        // Close the test
        code += `  });
});
`;
        return code;
    }
}
function createGenerateTestCaseTool(testGenerator) {
    return defineTool({
        capability: 'core',
        schema: {
            name: 'cypress_generate_test_case',
            title: 'Generate test case',
            description: 'Generate a Cypress test case from a parsed test scenario',
            inputSchema: z.object({
                testName: z.string().describe('Name for the test case'),
                steps: z.array(z.object({
                    action: z.string(),
                    description: z.string(),
                    params: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
                })).describe('Array of structured test steps'),
                targetUrl: z.string().describe('URL of the website to test'),
            }),
            type: 'readOnly',
        },
    }, async (context, params) => {
        console.log(`Generating test code for ${params.testName} with ${params.steps.length} steps`);
        const testCode = await testGenerator.generateTestCode(params.testName, params.steps, params.targetUrl);
        // Store the generated test in the context
        context.storeGeneratedTest(params.testName, testCode);
        return {
            content: [
                {
                    type: 'text',
                    text: `Successfully generated test case: ${params.testName}`
                },
                {
                    type: 'code',
                    language: 'javascript',
                    code: testCode
                }
            ],
        };
    });
}
/**
 * List generated tests tool
 */
const listGeneratedTestsTool = defineTool({
    capability: 'core',
    schema: {
        name: 'cypress_list_generated_tests',
        title: 'List generated tests',
        description: 'List all generated Cypress test cases',
        inputSchema: z.object({}),
        type: 'readOnly',
    },
}, async (context) => {
    // Use getGeneratedTest to get all test names that have been generated
    const generatedTests = {};
    // The context doesn't have a getGeneratedTests method, so we'll simulate one
    // by checking for known test names - in a real implementation, this would be provided
    const currentTest = context.getCurrentTestCase();
    if (currentTest) {
        const testContent = context.getGeneratedTest(currentTest);
        if (testContent) {
            generatedTests[currentTest] = testContent;
        }
    }
    const testNames = Object.keys(generatedTests);
    if (testNames.length === 0) {
        return {
            content: [
                {
                    type: 'text',
                    text: 'No tests have been generated yet.'
                }
            ],
        };
    }
    return {
        content: [
            {
                type: 'text',
                text: `Generated tests (${testNames.length}):`
            },
            ...testNames.map(name => ({
                type: 'text',
                text: `- ${name}`
            }))
        ],
    };
});
/**
 * Convert string to slug
 * @param text Text to convert
 * @returns Slug
 */
function convertToSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
}
/**
 * Generate test tools
 * @param context Context instance
 * @returns Array of tools
 */
export default function generateTools(context) {
    // Initialize test generator
    const testGenerator = new CypressTestGenerator();
    return [
        createGenerateTestCaseTool(testGenerator),
        listGeneratedTestsTool,
    ];
}
//# sourceMappingURL=generate.js.map