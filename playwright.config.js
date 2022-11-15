// @ts-check
const { devices } = require('@playwright/test');
const path = require('path');

/**
 * @see https://playwright.dev/docs/test-configuration
 * @type {import('@playwright/test').PlaywrightTestConfig}
 */
const config = {
  timeout: 30 * 1000,
  testDir: path.join(__dirname, 'e2e'),
  retries: 0,
  outputDir: 'test-results/',
  use: {
    trace: 'on',
    contextOptions: {
      ignoreHTTPSErrors: true,
    },
    baseURL: 'https://graphql-teas-endpoint.netlify.app/'
  },

  
};
module.exports = config;
