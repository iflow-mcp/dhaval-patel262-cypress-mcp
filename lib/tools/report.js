/**
 * Copyright (c) 2024
 *
 * Licensed under the MIT License
 */
import { z } from 'zod';
import { defineTool } from './tool.js';
/**
 * Report tools
 * @param context Context instance
 * @returns Array of tools
 */
export default function reportTools(context) {
    return [
        generateTestReport,
        generateSummaryReport,
    ];
}
/**
 * Generate test report tool definition
 */
const generateTestReport = defineTool({
    capability: 'core',
    schema: {
        name: 'cypress_generate_test_report',
        title: 'Generate test report',
        description: 'Generate a detailed report for a specific test case',
        inputSchema: z.object({
            testName: z.string().describe('Name of the test to report on'),
            format: z.enum(['html', 'json', 'markdown']).default('html').describe('Format of the report'),
        }),
        type: 'readOnly',
    },
}, async (context, params) => {
    // Generate a filename from the test name
    const fileName = `${convertToSlug(params.testName)}.cy.js`;
    // Get test results
    const testResults = context.getTestResults(fileName);
    if (!testResults) {
        return {
            content: [{
                    type: 'text',
                    text: `No execution results found for test case '${params.testName}'.`
                }],
            isError: true,
        };
    }
    // Generate report based on format
    switch (params.format) {
        case 'html':
            const htmlReport = generateHtmlReport(testResults);
            return {
                content: [
                    {
                        type: 'text',
                        text: `Generated HTML report for test case '${params.testName}'`
                    },
                    {
                        type: 'html',
                        html: htmlReport
                    }
                ],
            };
        case 'markdown':
            const markdownReport = generateMarkdownReport(testResults);
            return {
                content: [
                    {
                        type: 'text',
                        text: `Generated Markdown report for test case '${params.testName}'`
                    },
                    {
                        type: 'code',
                        language: 'markdown',
                        code: markdownReport
                    }
                ],
            };
        case 'json':
        default:
            return {
                content: [
                    {
                        type: 'text',
                        text: `Generated JSON report for test case '${params.testName}'`
                    },
                    {
                        type: 'code',
                        language: 'json',
                        code: JSON.stringify(testResults, null, 2)
                    }
                ],
            };
    }
});
/**
 * Generate summary report tool definition
 */
const generateSummaryReport = defineTool({
    capability: 'core',
    schema: {
        name: 'cypress_generate_summary_report',
        title: 'Generate summary report',
        description: 'Generate a summary report for all test cases',
        inputSchema: z.object({
            format: z.enum(['html', 'json', 'markdown']).default('html').describe('Format of the report'),
        }),
        type: 'readOnly',
    },
}, async (context, params) => {
    // In a real implementation, this would gather results from all tests
    // For now, we'll use the current test case
    const currentTestCase = context.getCurrentTestCase();
    if (!currentTestCase) {
        return {
            content: [{
                    type: 'text',
                    text: 'No test cases available to report on.'
                }],
            isError: true,
        };
    }
    const fileName = `${convertToSlug(currentTestCase)}.cy.js`;
    const testResults = context.getTestResults(fileName);
    if (!testResults) {
        return {
            content: [{
                    type: 'text',
                    text: 'No test results available to report on.'
                }],
            isError: true,
        };
    }
    // Create a summary of all test results
    const summaryResults = {
        totalTests: 1,
        passed: testResults.passed ? 1 : 0,
        failed: testResults.passed ? 0 : 1,
        duration: testResults.duration,
        timestamp: new Date().toISOString(),
        tests: [testResults]
    };
    // Generate report based on format
    switch (params.format) {
        case 'html':
            const htmlReport = generateSummaryHtmlReport(summaryResults);
            return {
                content: [
                    {
                        type: 'text',
                        text: `Generated HTML summary report`
                    },
                    {
                        type: 'html',
                        html: htmlReport
                    }
                ],
            };
        case 'markdown':
            const markdownReport = generateSummaryMarkdownReport(summaryResults);
            return {
                content: [
                    {
                        type: 'text',
                        text: `Generated Markdown summary report`
                    },
                    {
                        type: 'code',
                        language: 'markdown',
                        code: markdownReport
                    }
                ],
            };
        case 'json':
        default:
            return {
                content: [
                    {
                        type: 'text',
                        text: `Generated JSON summary report`
                    },
                    {
                        type: 'code',
                        language: 'json',
                        code: JSON.stringify(summaryResults, null, 2)
                    }
                ],
            };
    }
});
/**
 * Generate HTML report
 * @param testResults Test results
 * @returns HTML report
 */
function generateHtmlReport(testResults) {
    const statusClass = testResults.passed ? 'passed' : 'failed';
    const statusText = testResults.passed ? 'PASSED' : 'FAILED';
    return `
<!DOCTYPE html>
<html>
<head>
  <title>Test Report: ${testResults.testName}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
    .header { background-color: #f5f5f5; padding: 15px; border-radius: 5px; }
    .status { display: inline-block; padding: 5px 10px; border-radius: 3px; color: white; }
    .passed { background-color: #4CAF50; }
    .failed { background-color: #F44336; }
    .step { margin: 15px 0; padding: 10px; border-left: 3px solid #ddd; }
    .step.passed { border-left-color: #4CAF50; }
    .step.failed { border-left-color: #F44336; }
    .details { margin-top: 10px; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Test Report: ${testResults.testName}</h1>
    <p><strong>Status:</strong> <span class="status ${statusClass}">${statusText}</span></p>
    <p><strong>Duration:</strong> ${testResults.duration}ms</p>
    <p><strong>Timestamp:</strong> ${testResults.timestamp}</p>
  </div>
  
  <h2>Steps</h2>
  ${testResults.steps.map((step, index) => `
    <div class="step ${step.passed ? 'passed' : 'failed'}">
      <h3>Step ${index + 1}: ${step.description}</h3>
      <p><strong>Status:</strong> ${step.passed ? 'Passed' : 'Failed'}</p>
      <p><strong>Duration:</strong> ${step.duration}ms</p>
      ${step.details ? `<div class="details">${step.details}</div>` : ''}
    </div>
  `).join('')}
</body>
</html>
  `;
}
/**
 * Generate Markdown report
 * @param testResults Test results
 * @returns Markdown report
 */
function generateMarkdownReport(testResults) {
    return `# Test Report: ${testResults.testName}

**Status:** ${testResults.passed ? 'PASSED ✅' : 'FAILED ❌'}  
**Duration:** ${testResults.duration}ms  
**Timestamp:** ${testResults.timestamp}

## Steps

${testResults.steps.map((step, index) => `
### Step ${index + 1}: ${step.description}

- **Status:** ${step.passed ? 'Passed ✅' : 'Failed ❌'}
- **Duration:** ${step.duration}ms
${step.details ? `- **Details:** ${step.details}` : ''}
`).join('')}
`;
}
/**
 * Generate HTML summary report
 * @param summaryResults Summary results
 * @returns HTML summary report
 */
function generateSummaryHtmlReport(summaryResults) {
    const passRate = (summaryResults.passed / summaryResults.totalTests) * 100;
    return `
<!DOCTYPE html>
<html>
<head>
  <title>Test Summary Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
    .header { background-color: #f5f5f5; padding: 15px; border-radius: 5px; }
    .summary { display: flex; margin: 20px 0; }
    .summary-box { flex: 1; text-align: center; padding: 15px; margin: 0 10px; border-radius: 5px; color: white; }
    .total { background-color: #2196F3; }
    .passed { background-color: #4CAF50; }
    .failed { background-color: #F44336; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f5f5f5; }
    .status { display: inline-block; padding: 3px 6px; border-radius: 3px; color: white; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Test Summary Report</h1>
    <p><strong>Timestamp:</strong> ${summaryResults.timestamp}</p>
    <p><strong>Total Duration:</strong> ${summaryResults.duration}ms</p>
  </div>
  
  <div class="summary">
    <div class="summary-box total">
      <h2>Total Tests</h2>
      <p>${summaryResults.totalTests}</p>
    </div>
    <div class="summary-box passed">
      <h2>Passed</h2>
      <p>${summaryResults.passed} (${passRate.toFixed(1)}%)</p>
    </div>
    <div class="summary-box failed">
      <h2>Failed</h2>
      <p>${summaryResults.failed}</p>
    </div>
  </div>
  
  <h2>Test Details</h2>
  <table>
    <tr>
      <th>Test Name</th>
      <th>Status</th>
      <th>Duration</th>
    </tr>
    ${summaryResults.tests.map((test) => `
      <tr>
        <td>${test.testName}</td>
        <td><span class="status ${test.passed ? 'passed' : 'failed'}">${test.passed ? 'PASSED' : 'FAILED'}</span></td>
        <td>${test.duration}ms</td>
      </tr>
    `).join('')}
  </table>
</body>
</html>
  `;
}
/**
 * Generate Markdown summary report
 * @param summaryResults Summary results
 * @returns Markdown summary report
 */
function generateSummaryMarkdownReport(summaryResults) {
    const passRate = (summaryResults.passed / summaryResults.totalTests) * 100;
    return `# Test Summary Report

**Timestamp:** ${summaryResults.timestamp}  
**Total Duration:** ${summaryResults.duration}ms

## Summary

- **Total Tests:** ${summaryResults.totalTests}
- **Passed:** ${summaryResults.passed} (${passRate.toFixed(1)}%)
- **Failed:** ${summaryResults.failed}

## Test Details

| Test Name | Status | Duration |
|-----------|--------|----------|
${summaryResults.tests.map((test) => `| ${test.testName} | ${test.passed ? 'PASSED ✅' : 'FAILED ❌'} | ${test.duration}ms |`).join('\n')}
`;
}
/**
 * Convert string to slug
 * @param text Text to convert
 * @returns Slug
 */
function convertToSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '_');
}
//# sourceMappingURL=report.js.map