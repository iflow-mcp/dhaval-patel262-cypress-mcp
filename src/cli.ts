/**
 * Copyright (c) 2024
 *
 * Licensed under the MIT License
 */

import { Command } from 'commander';
import { createConnection } from './index.js';

// Define a custom transport interface for MCP communication
interface Transport {
  start(): Promise<void>;
  send(message: any, options?: any): Promise<void>;
  close(): Promise<void>;
}

// Create a custom transport that uses stdin/stdout for MCP communication
function createStdioTransport(): Transport {
  return {
    // Initialize the transport
    async start(): Promise<void> {
      // No initialization needed for stdio
    },

    // Send a message through stdout
    async send(message: any): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        const jsonString = JSON.stringify(message);
        process.stdout.write(jsonString + '\n', (error) => {
          if (error) reject(new Error(`Write error: ${error.message}`));
          else resolve();
        });
      });
    },

    // Close the transport
    async close(): Promise<void> {
      // No cleanup needed for stdio
    }
  };
}


// Create command line program
const program = new Command();

// Define version from package.json
const packageJson = { version: '0.0.1' };
program.version(packageJson.version);

// Add options
program
  .option('--headless', 'Run Cypress in headless mode')
  .option('--project-path <path>', 'Path to Cypress project')
  .option('--browser <browser>', 'Browser to use (chrome, firefox, edge, electron)', 'chrome')
  .option('--detailed-reports', 'Generate detailed test reports')
  .action(async (options) => {
    console.log('Starting Cypress MCP Server...');
    
    try {
      // Create connection
      const connection = await createConnection({
        headless: options.headless,
        projectPath: options.projectPath,
        browser: options.browser,
        detailedReports: options.detailedReports,
      });
      
      // Connect to standard input/output for MCP communication
      console.log('Connecting to MCP client...');
      const transport = createStdioTransport();
      await connection.connect(transport);
      
      // Handle process termination
      const cleanup = async () => {
        console.log('Closing Cypress MCP Server...');
        await connection.close();
        process.exit(0);
      };
      
      process.on('SIGINT', cleanup);
      process.on('SIGTERM', cleanup);
      
    } catch (error) {
      console.error('Failed to start Cypress MCP Server:', error);
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse(process.argv);
