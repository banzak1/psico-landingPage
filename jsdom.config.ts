import { TestEnvironment } from 'jest-environment-jsdom';

/**
 * Custom JSDOM environment for Jest.
 * Extends the default jsdom environment with project-specific setup.
 */
export default class CustomJsdomEnvironment extends TestEnvironment {
  async setup() {
    await super.setup();
    // Add any global mocks or setup needed for all tests here
  }
}
