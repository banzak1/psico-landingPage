// jest.setup.js - Single initialization guard for Angular test environment
// setupFiles runs AFTER jsdom is created, so zone.js can patch timers

if (!global.__jest_preset_angular_initialized__) {
  global.__jest_preset_angular_initialized__ = true;
  require('jest-preset-angular/setup-jest');
}
