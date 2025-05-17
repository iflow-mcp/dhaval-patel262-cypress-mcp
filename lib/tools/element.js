/**
 * Copyright (c) 2024
 *
 * Licensed under the MIT License
 */
import { z } from 'zod';
import { defineTool } from './tool.js';
/**
 * Element interaction tools for Cypress
 */
/**
 * Click on an element
 */
export const click = defineTool({
    capability: 'interaction',
    schema: {
        name: 'cypress_click',
        title: 'Click Element',
        description: 'Click on an element on the page using Cypress',
        inputSchema: z.object({
            selector: z.string().describe('CSS selector for the element to click'),
            force: z.boolean().optional().describe('Force the click even if the element is not visible'),
        }),
        type: 'destructive',
    }
}, async (context, params) => {
    const { selector, force } = params;
    let code = [`// Click the element with selector "${selector}"`];
    if (force) {
        code.push(`cy.get('${selector}').click({ force: true });`);
    }
    else {
        code.push(`cy.get('${selector}').click();`);
    }
    return {
        content: [
            {
                type: 'text',
                text: `Clicking element with selector "${selector}"${force ? " (forced)" : ""}`
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
 * Double-click on an element
 */
export const doubleClick = defineTool({
    capability: 'interaction',
    schema: {
        name: 'cypress_double_click',
        title: 'Double-Click Element',
        description: 'Double-click on an element on the page',
        inputSchema: z.object({
            selector: z.string().describe('CSS selector for the element to double-click'),
            force: z.boolean().optional().describe('Force the click even if the element is not visible'),
        }),
        type: 'destructive',
    }
}, async (context, params) => {
    const { selector, force } = params;
    let code = [`// Double-click the element with selector "${selector}"`];
    if (force) {
        code.push(`cy.get('${selector}').dblclick({ force: true });`);
    }
    else {
        code.push(`cy.get('${selector}').dblclick();`);
    }
    return {
        content: [
            {
                type: 'text',
                text: `Double-clicking element with selector "${selector}"${force ? " (forced)" : ""}`
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
 * Type text into an element
 */
export const typeText = defineTool({
    capability: 'interaction',
    schema: {
        name: 'cypress_type',
        title: 'Type Text',
        description: 'Type text into an input element',
        inputSchema: z.object({
            selector: z.string().describe('CSS selector for the element to type into'),
            text: z.string().describe('Text to type into the element'),
            clear: z.boolean().optional().describe('Clear the input before typing'),
        }),
        type: 'destructive',
    }
}, async (context, params) => {
    const { selector, text, clear } = params;
    const code = [`// Type "${text}" into the element with selector "${selector}"`];
    if (clear) {
        code.push(`cy.get('${selector}').clear();`);
    }
    code.push(`cy.get('${selector}').type('${text.replace(/'/g, "\\'")}');`);
    return {
        content: [
            {
                type: 'text',
                text: `Typing "${text}" into element with selector "${selector}"${clear ? " (after clearing)" : ""}`
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
 * Get element text
 */
export const getText = defineTool({
    capability: 'query',
    schema: {
        name: 'cypress_get_text',
        title: 'Get Element Text',
        description: 'Get the text content of an element',
        inputSchema: z.object({
            selector: z.string().describe('CSS selector for the element to get text from'),
        }),
        type: 'readOnly',
    }
}, async (context, params) => {
    const { selector } = params;
    const code = [
        `// Get the text content of the element with selector "${selector}"`,
        `cy.get('${selector}').then(($el) => {`,
        `  const text = $el.text();`,
        `  cy.log('Element text: ' + text);`,
        `  // Do something with the text`,
        `});`,
    ].join('\n');
    return {
        content: [
            {
                type: 'text',
                text: `Getting text from element with selector "${selector}"`
            },
            {
                type: 'code',
                code,
                language: 'javascript'
            }
        ]
    };
});
/**
 * Check if element exists
 */
export const elementExists = defineTool({
    capability: 'query',
    schema: {
        name: 'cypress_element_exists',
        title: 'Element Exists',
        description: 'Check if an element exists on the page',
        inputSchema: z.object({
            selector: z.string().describe('CSS selector for the element to check'),
        }),
        type: 'readOnly',
    }
}, async (context, params) => {
    const { selector } = params;
    const code = [
        `// Check if the element with selector "${selector}" exists`,
        `cy.get('${selector}').should('exist');`,
    ].join('\n');
    return {
        content: [
            {
                type: 'text',
                text: `Checking if element with selector "${selector}" exists`
            },
            {
                type: 'code',
                code,
                language: 'javascript'
            }
        ]
    };
});
/**
 * Export all element interaction tools
 */
export const elementTools = [
    click,
    doubleClick,
    typeText,
    getText,
    elementExists,
];
//# sourceMappingURL=element.js.map