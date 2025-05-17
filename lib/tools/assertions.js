/**
 * Copyright (c) 2024
 *
 * Licensed under the MIT License
 */
import { z } from 'zod';
import { defineTool } from './tool.js';
/**
 * Assertion tools for Cypress
 */
/**
 * Assert element content
 */
export const assertText = defineTool({
    capability: 'assertion',
    schema: {
        name: 'cypress_assert_text',
        title: 'Assert Text Content',
        description: 'Assert that an element contains specific text',
        inputSchema: z.object({
            selector: z.string().describe('CSS selector for the element'),
            text: z.string().describe('Text that the element should contain'),
            exact: z.boolean().optional().describe('Whether the text must match exactly (true) or just be contained (false)'),
        }),
        type: 'readOnly',
    }
}, async (context, params) => {
    const { selector, text, exact } = params;
    let code;
    if (exact) {
        code = [
            `// Assert that element with selector "${selector}" has the exact text "${text}"`,
            `cy.get('${selector}').should('have.text', '${text.replace(/'/g, "\\'")}');`,
        ];
    }
    else {
        code = [
            `// Assert that element with selector "${selector}" contains the text "${text}"`,
            `cy.get('${selector}').should('contain', '${text.replace(/'/g, "\\'")}');`,
        ];
    }
    return {
        content: [
            {
                type: 'text',
                text: `Asserting that element with selector "${selector}" ${exact ? 'has exactly' : 'contains'} text "${text}"`
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
 * Assert element visibility
 */
export const assertVisible = defineTool({
    capability: 'assertion',
    schema: {
        name: 'cypress_assert_visible',
        title: 'Assert Element Visibility',
        description: 'Assert that an element is visible',
        inputSchema: z.object({
            selector: z.string().describe('CSS selector for the element'),
            negated: z.boolean().optional().describe('If true, assert that the element is not visible'),
        }),
        type: 'readOnly',
    }
}, async (context, params) => {
    const { selector, negated } = params;
    const assertion = negated ? 'not.be.visible' : 'be.visible';
    const code = [
        `// Assert that element with selector "${selector}" is ${negated ? 'not ' : ''}visible`,
        `cy.get('${selector}').should('${assertion}');`,
    ];
    return {
        content: [
            {
                type: 'text',
                text: `Asserting that element with selector "${selector}" is ${negated ? 'not ' : ''}visible`
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
 * Assert element attribute
 */
export const assertAttribute = defineTool({
    capability: 'assertion',
    schema: {
        name: 'cypress_assert_attribute',
        title: 'Assert Element Attribute',
        description: 'Assert that an element has a specific attribute with a specific value',
        inputSchema: z.object({
            selector: z.string().describe('CSS selector for the element'),
            attribute: z.string().describe('Name of the attribute'),
            value: z.string().describe('Expected value of the attribute'),
        }),
        type: 'readOnly',
    }
}, async (context, params) => {
    const { selector, attribute, value } = params;
    const code = [
        `// Assert that element with selector "${selector}" has attribute "${attribute}" with value "${value}"`,
        `cy.get('${selector}').should('have.attr', '${attribute}', '${value.replace(/'/g, "\\'")}');`,
    ];
    return {
        content: [
            {
                type: 'text',
                text: `Asserting that element with selector "${selector}" has attribute "${attribute}" with value "${value}"`
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
 * Assert URL
 */
export const assertUrl = defineTool({
    capability: 'assertion',
    schema: {
        name: 'cypress_assert_url',
        title: 'Assert URL',
        description: 'Assert that the current URL matches a specific pattern',
        inputSchema: z.object({
            url: z.string().describe('URL or URL pattern to match'),
            exact: z.boolean().optional().describe('Whether the URL must match exactly (true) or just include the pattern (false)'),
        }),
        type: 'readOnly',
    }
}, async (context, params) => {
    const { url, exact } = params;
    let code;
    if (exact) {
        code = [
            `// Assert that the current URL is exactly "${url}"`,
            `cy.url().should('eq', '${url.replace(/'/g, "\\'")}');`,
        ];
    }
    else {
        code = [
            `// Assert that the current URL contains "${url}"`,
            `cy.url().should('include', '${url.replace(/'/g, "\\'")}');`,
        ];
    }
    return {
        content: [
            {
                type: 'text',
                text: `Asserting that current URL ${exact ? 'is exactly' : 'contains'} "${url}"`
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
 * Assert element count
 */
export const assertCount = defineTool({
    capability: 'assertion',
    schema: {
        name: 'cypress_assert_count',
        title: 'Assert Element Count',
        description: 'Assert that there are a specific number of elements matching a selector',
        inputSchema: z.object({
            selector: z.string().describe('CSS selector for the elements'),
            count: z.number().describe('Expected number of elements'),
        }),
        type: 'readOnly',
    }
}, async (context, params) => {
    const { selector, count } = params;
    const code = [
        `// Assert that there are ${count} elements matching selector "${selector}"`,
        `cy.get('${selector}').should('have.length', ${count});`,
    ];
    return {
        content: [
            {
                type: 'text',
                text: `Asserting that there are ${count} elements matching selector "${selector}"`
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
 * Export all assertion tools
 */
export const assertionTools = [
    assertText,
    assertVisible,
    assertAttribute,
    assertUrl,
    assertCount,
];
//# sourceMappingURL=assertions.js.map