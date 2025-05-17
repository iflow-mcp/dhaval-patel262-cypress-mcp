/**
 * Copyright (c) 2024
 *
 * Licensed under the MIT License
 */
import { Command } from 'commander';
import { startHttpTransport, startStdioTransport } from './server.js';
// Create command line program
const program = new Command();
// Define version from package.json
const packageJson = { version: '0.0.1' };
program.version(packageJson.version);
// Add common options
program
    .option('--headless', 'Run Cypress in headless mode')
    .option('--project-path <path>', 'Path to Cypress project')
    .option('--browser <browser>', 'Browser to use (chrome, firefox, edge, electron)', 'chrome')
    .option('--detailed-reports', 'Generate detailed test reports');
// HTTP server mode
program
    .command('http')
    .description('Start HTTP server for MCP')
    .option('-p, --port <port>', 'Port to listen on', (value) => parseInt(value, 10), 3000)
    .option('-h, --hostname <hostname>', 'Hostname to listen on', '0.0.0.0')
    .action(async (options) => {
    console.log('Starting Cypress MCP HTTP Server...');
    try {
        const serverOptions = {
            headless: program.opts().headless,
            projectPath: program.opts().projectPath,
            browser: program.opts().browser,
            detailedReports: program.opts().detailedReports,
            port: options.port,
            hostname: options.hostname
        };
        startHttpTransport(serverOptions);
    }
    catch (error) {
        console.error('Failed to start Cypress MCP HTTP Server:', error);
        process.exit(1);
    }
});
// Stdio mode (default)
program
    .command('stdio', { isDefault: true })
    .description('Use standard input/output for MCP communication')
    .action(async () => {
    try {
        const options = {
            headless: program.opts().headless,
            projectPath: program.opts().projectPath,
            browser: program.opts().browser,
            detailedReports: program.opts().detailedReports,
        };
        await startStdioTransport(options);
    }
    catch (error) {
        console.error('Failed to start Cypress MCP Server:', error);
        process.exit(1);
    }
});
// Parse command line arguments
program.parse(process.argv);
//# sourceMappingURL=cli-server.js.map