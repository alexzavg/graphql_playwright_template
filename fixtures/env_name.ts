import { test as base } from '@playwright/test';
import { color } from '../helpers/common.helper';

export const test = base.extend<{ saveLogs: void }>({

  saveLogs: [ async ({}, use) => {
    console.log(color.info(`<<< ENVIRONMENT: ${process.env.ENV_NAME} >>>`));
    await use();
  }, { auto: true } ]

});