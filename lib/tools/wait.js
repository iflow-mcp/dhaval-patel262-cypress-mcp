/**
 * Copyright (c) 2024
 *
 * Licensed under the MIT License
 */
import { z } from 'zod';
import { defineTool } from './tool.js';
/**
 * Waiting tools for Cypress
 */
/**
 * Wait for an element
 */
export const waitForElement = defineTool({
    capability: 'wait',
    schema: {
        name: 'cypress_wait_for_element',
        title: 'Wait For Element',
        description: 'Wait for an element to appear or meet a specific condition',
        inputSchema: z.object({
            selector: z.string().describe('CSS selector for the element to wait for'),
            state: z.enum(['exist', 'visible', 'enabled', 'disabled']).describe('State to wait for'),
            timeout: z.number().optional().describe('Timeout in milliseconds (default is 4000ms)'),
        }),
        type: 'readOnly',
    }
}, async (context, params) => {
    const { selector, state, timeout } = params;
    let code;
    if (timeout) {
        code = [
            `// Wait for element with selector "${selector}" to be ${state}`,
            `cy.get('${selector}', { timeout: ${timeout} }).should('${state}');`,
        ];
    }
    else {
        code = [
            `// Wait for element with selector "${selector}" to be ${state}`,
            `cy.get('${selector}').should('${state}');`,
        ];
    }
    return {
        content: [
            {
                type: 'text',
                text: `Waiting for element with selector "${selector}" to be ${state}${timeout ? ' (timeout: ' + timeout + 'ms)' : ''}`
            },
            {
                type: 'code',
                code: code.join('\n'),
                language: 'javascript'
            }
        ]
    };
});
/**
 * Wait for page load
 */
export const waitForPageLoad = defineTool({
    capability: 'wait',
    schema: {
        name: 'cypress_wait_for_page_load',
        title: 'Wait For Page Load',
        description: 'Wait for the page to finish loading',
        inputSchema: z.object({
            timeout: z.number().optional().describe('Timeout in milliseconds (default is 60000ms)'),
        }),
        type: 'readOnly',
    }
}, async (context, params) => {
    const { timeout } = params;
    let code;
    if (timeout) {
        code = [
            `// Wait for the page to finish loading`,
            `cy.document({ timeout: ${timeout} }).should('have.property', 'readyState', 'complete');`,
        ];
    }
    else {
        code = [
            `// Wait for the page to finish loading`,
            `cy.document().should('have.property', 'readyState', 'complete');`,
        ];
    }
    return {
        content: [
            {
                type: 'text',
                text: `Waiting for page to finish loading${timeout ? ' (timeout: ' + timeout + 'ms)' : ''}`
            },
            {
                type: 'code',
                code: code.join('\n'),
                language: 'javascript'
            }
        ]
    };
});
/**
 * Wait for a fixed time
 */
export const waitForTime = defineTool({
    capability: 'wait',
    schema: {
        name: 'cypress_wait',
        title: 'Wait',
        description: 'Wait for a specified amount of time',
        inputSchema: z.object({
            time: z.number().describe('Time to wait in milliseconds'),
        }),
        type: 'readOnly',
    }
}, async (context, params) => {
    const { time } = params;
    const code = [
        `// Wait for ${time} milliseconds`,
        `cy.wait(${time});`,
    ].join('\n');
    return {
        content: [
            {
                type: 'text',
                text: `Waiting for ${time} milliseconds`
            },
            {
                type: 'code',
                code,
                language: 'javascript'
            },
            {
                type: 'text',
                text: `Note: Fixed waiting times should be avoided when possible. Consider using element or condition-based waiting instead.`
            }
        ]
    };
});
/**
 * Wait for a network request to complete
 */
export const waitForRequest = defineTool({
    capability: 'wait',
    schema: {
        name: 'cypress_wait_for_request',
        title: 'Wait For Request',
        description: 'Wait for a specific network request to complete',
        inputSchema: z.object({
            url: z.string().describe('URL pattern to match for the network request'),
            alias: z.string().optional().describe('Alias to use for the network request'),
            timeout: z.number().optional().describe('Timeout in milliseconds (default is 5000ms)'),
        }),
        type: 'readOnly',
    }
}, async (context, params) => {
    const { url, alias, timeout } = params;
    const aliasName = alias ?? `request_${Date.now()}`;
    let code;
    if (timeout) {
        code = [
            `// Intercept and wait for network request`,
            `cy.intercept('${url}').as('${aliasName}');`,
            `// Perform an action that triggers the request here`,
            `cy.wait('@${aliasName}', { timeout: ${timeout} });`,
        ];
    }
    else {
        code = [
            `// Intercept and wait for network request`,
            `cy.intercept('${url}').as('${aliasName}');`,
            `// Perform an action that triggers the request here`,
            `cy.wait('@${aliasName}');`,
        ];
    }
    return {
        content: [
            {
                type: 'text',
                text: `Waiting for network request matching "${url}"${timeout ? ' (timeout: ' + timeout + 'ms)' : ''}`
            },
            {
                type: 'code',
                code: code.join('\n'),
                language: 'javascript'
            }
        ]
    };
});
/**
 * Export all waiting tools
 */
export const waitTools = [
    waitForElement,
    waitForPageLoad,
    waitForTime,
    waitForRequest,
];
//# sourceMappingURL=wait.js.map