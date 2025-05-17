# Cypress MCP Server

A Model Context Protocol (MCP) server for Cypress that enables AI systems to create, execute, and analyze automated tests for web applications through the Model Context Protocol (MCP).

## 🎉 Enhanced Implementation

This project implements a robust HTTP transport with Server-Sent Events (SSE) support, following the same architecture as the Playwright MCP server. Our implementation leverages the official `@modelcontextprotocol/sdk` package to ensure full compliance with the MCP specification.

## Features

- **Standards-Compliant MCP Implementation**: Implements the Model Context Protocol using the official SDK
- **HTTP Transport with SSE Support**: Reliable server-client communication using Server-Sent Events
- **Streamable HTTP Support**: Alternative transport method for compatible clients
- **Natural Language Test Parsing**: Convert plain English test scenarios into structured test plans
- **Cypress Test Generation**: Generate executable Cypress tests from structured test plans
- **Test Execution**: Run tests against real websites
- **Test Reporting**: Generate detailed reports of test execution results
- **Containerized Deployment**: Easy deployment using Docker

## Available Tools

The Cypress MCP server provides the following categories of tools that AI systems can use to interact with web applications:

### Core Testing Tools

- **Test Generation**: Convert natural language descriptions into executable Cypress tests
- **Test Execution**: Run tests against real websites and gather results
- **Test Reporting**: Generate detailed reports of test execution

### Browser Automation Tools

#### Navigation Tools
- `cypress_navigate` - Navigate to a URL
- `cypress_go_back` - Go back in browser history
- `cypress_go_forward` - Go forward in browser history 
- `cypress_reload` - Reload the current page

#### Element Interaction Tools
- `cypress_click` - Click on an element
- `cypress_double_click` - Double-click on an element
- `cypress_type` - Type text into an input element
- `cypress_get_text` - Get the text content of an element
- `cypress_element_exists` - Check if an element exists

#### Assertion Tools
- `cypress_assert_text` - Assert element contains specific text
- `cypress_assert_visible` - Assert element visibility
- `cypress_assert_attribute` - Assert element has attribute with value
- `cypress_assert_url` - Assert URL matches pattern
- `cypress_assert_count` - Assert number of elements matching selector

#### Screenshot Tools
- `cypress_screenshot` - Take a screenshot of the page
- `cypress_element_screenshot` - Screenshot a specific element

#### Wait Tools
- `cypress_wait_for_element` - Wait for element to meet condition
- `cypress_wait_for_page_load` - Wait for page to finish loading
- `cypress_wait` - Wait for fixed time
- `cypress_wait_for_request` - Wait for network request

#### Network Tools
- `cypress_intercept_request` - Intercept network requests
- `cypress_mock_response` - Mock network responses
- `cypress_block_requests` - Block network requests

## Requirements

- Node.js 18 or newer
- Cypress 13.x or newer
- An MCP client (VS Code, Claude for VSCode, Anthropic Claude, GitHub Copilot, etc.)

## Installation

### Local Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

4. Start the server:

```bash
node lib/cli-server.js http
```

To run in headless mode (recommended for production):

```bash
node lib/cli-server.js http --headless
```

### Docker Installation

For easier deployment and isolation, you can use Docker:

1. Build the Docker image:

```bash
docker build -t cypress-mcp .
```

2. Run the container:

```bash
docker run -d --name cypress-mcp -p 3000:3000 -e NODE_ENV=production -e OPENAI_API_KEY=your-api-key-here -e HEADLESS=true cypress-mcp
```

### Docker Compose Installation

Alternatively, you can use Docker Compose for easier management:

1. Create a `.env` file with your environment variables:

```
OPENAI_API_KEY=your-api-key-here
HEADLESS=true
```

2. Run with Docker Compose:

```bash
docker-compose up -d
```

## VSCode Configuration

To use the Cypress MCP Server with VSCode or other AI assistants, add the following to your `mcp_config.json` file:

```json
{
  "mcpServers": {
    "cypress": {
      "serverUrl": "http://localhost:3000/sse"
    }
  }
}
```

If your client supports streamable HTTP (check your client's documentation), you can also use:

```json
{
  "mcpServers": {
    "cypress": {
      "serverUrl": "http://localhost:3000/mcp"
    }
  }
}
```

## API Endpoints

The Cypress MCP server exposes the following endpoints:

- `/health` - Health check endpoint (responds with 200 OK if server is running)
- `/sse` - Server-Sent Events endpoint for MCP communication
- `/mcp` - Streamable HTTP endpoint for MCP communication (alternative transport)

## Environment Variables

- `OPENAI_API_KEY` - API key for OpenAI services (used for enhanced test generation)
- `HEADLESS` - Run Cypress in headless mode (default: false)
- `NODE_ENV` - Node environment (development, production, etc.)
- `PORT` - Port to run the server on (default: 3000)

## Development

### Project Structure

```
├── src/
│   ├── cli.js              # CLI entrypoint for stdin/stdout transport
│   ├── cli-server.js       # CLI entrypoint for HTTP transport
│   ├── server.ts           # HTTP server implementation
│   ├── connection.ts       # MCP connection management
│   ├── context.ts          # Test context management
│   ├── tools/
│   │   ├── tool.ts         # Base tool definitions
│   │   ├── navigate.ts     # Navigation tools
│   │   ├── element.ts      # Element interaction tools
│   │   ├── assertions.ts   # Assertion tools
│   │   ├── screenshot.ts   # Screenshot tools
│   │   ├── wait.ts         # Wait tools
│   │   ├── network.ts      # Network tools
│   │   └── ...
└── ...
```

### Extending the Server

To add new tools or functionality:

1. Create a new tool implementation in `src/tools/`
2. Register your tool in `src/tools.ts`
3. Build the project: `npm run build`
4. Test your changes

### Testing

Run the tests with:

```bash
npm test
```

## Troubleshooting

### Common Issues

#### Connection Issues

If your MCP client cannot connect to the server:

1. Ensure the server is running (`docker ps` or check your terminal)
2. Verify the correct port is exposed and not blocked by a firewall
3. Check your `mcp_config.json` is correctly configured
4. Make sure you're using the correct endpoint (/sse or /mcp)

#### Browser Crashes

If Cypress browser crashes:

1. Increase the Docker container's memory limits
2. Check for browser compatibility issues
3. Make sure HEADLESS is set to true in production environments

## License

MIT

## Additional Resources

- [Model Context Protocol (MCP) Documentation](https://github.com/anthropics/model-context-protocol)
- [Cypress Documentation](https://docs.cypress.io/)
- [Playwright MCP Server](https://github.com/microsoft/playwright-mcp)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

© 2025 Cypress MCP Server Contributors