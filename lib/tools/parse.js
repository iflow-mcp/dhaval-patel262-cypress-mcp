/**
 * Copyright (c) 2024
 *
 * Licensed under the MIT License
 */
import { z } from 'zod';
import { defineTool } from './tool.js';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
// Load environment variables
dotenv.config();
// OpenAI client for natural language processing
class NLPProcessor {
    apiKey;
    model;
    constructor(apiKey, model = 'gpt-3.5-turbo') {
        this.apiKey = apiKey ?? process.env.OPENAI_API_KEY;
        this.model = model;
    }
    async parseTestScenario(scenario, targetUrl) {
        // If no API key is available, use the simple parser
        if (!this.apiKey) {
            console.log('No OpenAI API key found, using simple parser');
            return this.simpleParser(scenario, targetUrl);
        }
        try {
            const prompt = `
        Parse the following test scenario into structured steps for Cypress testing.
        Format the output as a JSON array of step objects, each with "action", "description", and "params" fields.
        
        Test scenario: ${scenario}
        Target URL: ${targetUrl}
        
        Example format:
        [
          {
            "action": "navigate",
            "description": "Visit the target URL",
            "params": { "url": "https://example.com" }
          },
          {
            "action": "click",
            "description": "Click on the login button",
            "params": { "element": "button.login" }
          }
        ]
        
        Use the following action types:
        - navigate: Going to a URL
        - click: Clicking on an element
        - type: Entering text into a field
        - select: Selecting an option from a dropdown
        - assert: Verifying something on the page
        - wait: Waiting for something to happen
        - hover: Hovering over an element
        - focus: Focusing on an element
        - blur: Removing focus from an element
        - submit: Submitting a form
        - check: Checking a checkbox
        - uncheck: Unchecking a checkbox
        - screenshot: Taking a screenshot
        
        For elements, try to use CSS selectors or text content that would work well with Cypress commands.
        
        Return only the JSON array, no other text.
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
                        { role: 'system', content: 'You are a helpful assistant that parses test scenarios into structured steps for Cypress testing.' },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.3
                })
            });
            const data = await response.json();
            if (!response.ok) {
                console.error('OpenAI API error:', data);
                return this.simpleParser(scenario, targetUrl);
            }
            const content = data.choices[0]?.message?.content;
            if (!content) {
                console.error('Unexpected response format from OpenAI API');
                return this.simpleParser(scenario, targetUrl);
            }
            // Extract JSON from the response
            const jsonRegex = /\[\s*\{.*\}\s*\]/s;
            const jsonMatch = jsonRegex.exec(content);
            if (!jsonMatch) {
                console.error('Could not extract JSON from OpenAI response');
                return this.simpleParser(scenario, targetUrl);
            }
            try {
                const steps = JSON.parse(jsonMatch[0]);
                return { steps };
            }
            catch (e) {
                console.error('Error parsing JSON from OpenAI response:', e);
                return this.simpleParser(scenario, targetUrl);
            }
        }
        catch (error) {
            console.error('Error calling OpenAI API:', error);
            return this.simpleParser(scenario, targetUrl);
        }
    }
    simpleParser(scenario, targetUrl) {
        // Fallback to simple parsing logic
        return {
            steps: parseScenarioToSteps(scenario, targetUrl)
        };
    }
}
/**
 * Parse test scenario tool
 * @param context Context instance
 * @returns Array of tools
 */
export default function parseTools(_context) {
    // Initialize NLP processor for test scenario parsing
    const nlpProcessor = new NLPProcessor();
    return [
        parseTestScenario(nlpProcessor),
        listTestScenarios,
    ];
}
/**
 * Parse test scenario tool definition
 * @param nlpProcessor The NLP processor to use for parsing
 * @returns A tool definition for parsing test scenarios
 */
const parseTestScenario = (nlpProcessor) => defineTool({
    capability: 'core',
    schema: {
        name: 'cypress_parse_test_scenario',
        title: 'Parse test scenario',
        description: 'Parse a natural language test scenario into a structured format',
        inputSchema: z.object({
            scenario: z.string().describe('Natural language description of the test scenario'),
            targetUrl: z.string().describe('URL of the website to test'),
        }),
        type: 'readOnly',
    },
}, async (context, params) => {
    // Set current scenario
    context.setCurrentTestScenario(params.scenario);
    // Use NLP processor to parse the scenario into structured steps
    const result = await nlpProcessor.parseTestScenario(params.scenario, params.targetUrl);
    // Store the parsed steps in context for later use in test generation
    context.storeParsingResult(params.scenario, result.steps);
    return {
        content: [
            {
                type: 'text',
                text: `Successfully parsed test scenario for ${params.targetUrl}`
            },
            {
                type: 'code',
                language: 'json',
                code: JSON.stringify({
                    scenario: params.scenario,
                    targetUrl: params.targetUrl,
                    steps: result.steps,
                }, null, 2)
            }
        ],
    };
});
/**
 * List test scenarios tool definition
 */
const listTestScenarios = defineTool({
    capability: 'core',
    schema: {
        name: 'cypress_list_test_scenarios',
        title: 'List test scenarios',
        description: 'List all available test scenarios',
        inputSchema: z.object({}),
        type: 'readOnly',
    },
}, async (context, _) => {
    // In a real implementation, this would retrieve saved scenarios
    // For now, we'll return a simple message
    const currentScenario = context.getCurrentTestScenario();
    return {
        content: [
            {
                type: 'text',
                text: currentScenario
                    ? `Current scenario: ${currentScenario}`
                    : 'No test scenarios have been created yet.'
            }
        ],
    };
});
/**
 * Parse a natural language scenario into structured steps
 * @param scenario Natural language scenario description
 * @param targetUrl Target URL for the test
 * @returns Array of parsed steps
 */
function parseScenarioToSteps(scenario, targetUrl) {
    // This is a simplified parsing implementation
    // In a real implementation, you would use a more sophisticated approach
    // like NLP or a custom parser
    const steps = [];
    const lines = scenario.split('\n').filter(line => line.trim().length > 0);
    for (const line of lines) {
        // Look for common action patterns
        if (line.match(/visit|go to|navigate|open/i)) {
            steps.push({
                action: 'navigate',
                description: line.trim(),
                params: { url: extractUrl(line) }
            });
        }
        else if (line.match(/click|press|select|choose/i)) {
            steps.push({
                action: 'click',
                description: line.trim(),
                params: { element: extractElement(line) }
            });
        }
        else if (line.match(/type|enter|input|fill/i)) {
            steps.push({
                action: 'type',
                description: line.trim(),
                params: {
                    element: extractElement(line),
                    text: extractText(line)
                }
            });
        }
        else if (line.match(/assert|verify|check|ensure|expect/i)) {
            steps.push({
                action: 'assert',
                description: line.trim(),
                params: { assertion: line.trim() }
            });
        }
        else if (line.match(/wait|pause/i)) {
            steps.push({
                action: 'wait',
                description: line.trim(),
                params: { duration: extractDuration(line) }
            });
        }
        else {
            // Default to a generic step
            steps.push({
                action: 'custom',
                description: line.trim(),
            });
        }
    }
    return steps;
}
/**
 * Extract URL from text
 * @param text Text containing URL
 * @returns Extracted URL or empty string
 */
function extractUrl(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/;
    const match = text.match(urlRegex);
    return match ? match[1] : 'https://example.com';
}
/**
 * Extract element description from text
 * @param text Text containing element description
 * @returns Extracted element description
 */
function extractElement(text) {
    // This is a simplified implementation
    // In a real implementation, you would use a more sophisticated approach
    // Extract text between quotes if present
    const quoteMatch = text.match(/'([^']*)'|"([^"]*)"/);
    if (quoteMatch) {
        return quoteMatch[1] || quoteMatch[2];
    }
    // Look for element identifiers
    const elementMatch = text.match(/button|link|input|field|checkbox|dropdown|select|form|menu|tab|icon|image|label/i);
    if (elementMatch) {
        // Extract surrounding context
        const elementMatchIndex = text.indexOf(elementMatch[0]);
        const prefix = text.substring(Math.max(0, elementMatchIndex - 20), elementMatchIndex).trim();
        const suffix = text.substring(elementMatchIndex + elementMatch[0].length, Math.min(text.length, elementMatchIndex + elementMatch[0].length + 20)).trim();
        return `${prefix} ${elementMatch[0]} ${suffix}`.trim();
    }
    return 'unknown element';
}
/**
 * Extract text to type from text
 * @param text Text containing text to type
 * @returns Extracted text to type
 */
function extractText(text) {
    // Look for text between quotes
    const quoteMatch = text.match(/'([^']*)'|"([^"]*)"/);
    if (quoteMatch) {
        return quoteMatch[1] || quoteMatch[2];
    }
    return 'sample text';
}
/**
 * Extract duration from text
 * @param text Text containing duration
 * @returns Extracted duration in milliseconds
 */
function extractDuration(text) {
    const numberMatch = text.match(/\d+/);
    if (numberMatch) {
        const number = parseInt(numberMatch[0]);
        if (text.includes('second')) {
            return number * 1000;
        }
        else if (text.includes('minute')) {
            return number * 60000;
        }
        else if (text.includes('millisecond')) {
            return number;
        }
    }
    return 1000; // Default to 1 second
}
//# sourceMappingURL=parse.js.map