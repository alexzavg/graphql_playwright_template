// docs https://playwright.dev/docs/test-advanced#global-setup-and-teardown

import { FullConfig } from "@playwright/test";
import dotenv from "dotenv";

async function globalSetup(config: FullConfig) {
  
  if(process.env.test_env) {

    dotenv.config({
      path: `.env.${process.env.test_env}`,
      override: true
    })

  }

}

export default globalSetup;