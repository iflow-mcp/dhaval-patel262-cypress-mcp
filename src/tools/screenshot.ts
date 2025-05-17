/**
 * Copyright (c) 2024
 *
 * Licensed under the MIT License
 */

import { z } from 'zod';
import { defineTool } from './tool.js';
import type { Context } from '../context.js';

/**
 * Screenshot tools for Cypress
 */

/**
 * Take a screenshot of the page
 */
export const takeScreenshot = defineTool(
  {
    capability: 'capture',
    schema: {
      name: 'cypress_screenshot',
      title: 'Take Screenshot',
      description: 'Take a screenshot of the current page',
      inputSchema: z.object({
        name: z.string().optional().describe('Name of the screenshot file (without extension)'),
      }),
      type: 'readOnly',
    }
  },
  async (context: Context, params) => {
    const name = params.name ?? `screenshot_${Date.now()}`;
    
    const code = [
      `// Take a screenshot of the entire page`,
      `cy.screenshot('${name}');`,
    ].join('\n');
    
    return {
      content: [
        { 
          type: 'text', 
          text: `Taking screenshot of the entire page with name "${name}"` 
        },
        { 
          type: 'code', 
          code, 
          language: 'javascript' 
        }
      ]
    };
  }
);

/**
 * Take a screenshot of a specific element
 */
export const takeElementScreenshot = defineTool(
  {
    capability: 'capture',
    schema: {
      name: 'cypress_element_screenshot',
      title: 'Take Element Screenshot',
      description: 'Take a screenshot of a specific element on the page',
      inputSchema: z.object({
        selector: z.string().describe('CSS selector for the element to screenshot'),
        name: z.string().optional().describe('Name of the screenshot file (without extension)'),
      }),
      type: 'readOnly',
    }
  },
  async (context: Context, params) => {
    const { selector } = params;
    const name = params.name ?? `element_screenshot_${Date.now()}`;
    
    const code = [
      `// Take a screenshot of the element with selector "${selector}"`,
      `cy.get('${selector}').screenshot('${name}');`,
    ].join('\n');
    
    return {
      content: [
        { 
          type: 'text', 
          text: `Taking screenshot of element with selector "${selector}"` 
        },
        { 
          type: 'code', 
          code, 
          language: 'javascript' 
        }
      ]
    };
  }
);

/**
 * Export all screenshot tools
 */
export const screenshotTools = [
  takeScreenshot,
  takeElementScreenshot,
];
