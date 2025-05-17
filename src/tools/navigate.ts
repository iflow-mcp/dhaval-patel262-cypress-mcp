/**
 * Copyright (c) 2024
 *
 * Licensed under the MIT License
 */

import { z } from 'zod';
import { defineTool } from './tool.js';
import type { Context } from '../context.js';

/**
 * Navigation tools for Cypress
 */

/**
 * Navigate to a URL
 */
export const navigate = defineTool(
  {
    capability: 'core',
    schema: {
      name: 'cypress_navigate',
      title: 'Navigate to a URL',
      description: 'Navigate to a URL using Cypress',
      inputSchema: z.object({
        url: z.string().describe('The URL to navigate to'),
      }),
      type: 'destructive',
    }
  },
  async (context: Context, params) => {
    // Record the navigation in context
    context.saveArtifact(`navigation_${Date.now()}`, { url: params.url });
    
    const code = [
      `// Navigate to ${params.url}`,
      `cy.visit('${params.url}');`,
    ].join('\n');
    
    return {
      content: [
        { 
          type: 'text', 
          text: `Navigating to ${params.url}` 
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
 * Go back in browser history
 */
export const goBack = defineTool(
  {
    capability: 'history',
    schema: {
      name: 'cypress_go_back',
      title: 'Go Back',
      description: 'Navigate back in the browser history',
      inputSchema: z.object({}),
      type: 'destructive',
    }
  },
  async (context: Context) => {
    const code = [
      `// Navigate back in history`,
      `cy.go('back');`,
    ].join('\n');
    
    return {
      content: [
        { 
          type: 'text', 
          text: 'Going back in browser history' 
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
 * Go forward in browser history
 */
export const goForward = defineTool(
  {
    capability: 'history',
    schema: {
      name: 'cypress_go_forward',
      title: 'Go Forward',
      description: 'Navigate forward in the browser history',
      inputSchema: z.object({}),
      type: 'destructive',
    }
  },
  async (context: Context) => {
    const code = [
      `// Navigate forward in history`,
      `cy.go('forward');`,
    ].join('\n');
    
    return {
      content: [
        { 
          type: 'text', 
          text: 'Going forward in browser history' 
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
 * Reload the page
 */
export const reload = defineTool(
  {
    capability: 'core',
    schema: {
      name: 'cypress_reload',
      title: 'Reload Page',
      description: 'Reload the current page',
      inputSchema: z.object({}),
      type: 'destructive',
    }
  },
  async (context: Context) => {
    const code = [
      `// Reload the current page`,
      `cy.reload();`,
    ].join('\n');
    
    return {
      content: [
        { 
          type: 'text', 
          text: 'Reloading the current page' 
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
 * Export all navigation tools
 */
export const navigationTools = [
  navigate,
  goBack,
  goForward,
  reload,
];
