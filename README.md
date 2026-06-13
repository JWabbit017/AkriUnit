## Note: This was written only for the purpose of introducing students to the concept of unit testing - please don't use this for any serious projects.

## Basic Usage
 1. Ensure you have Node.js v24.0.0 or higher installed on your system.
 
 2. Install as a devDependency of your project with npm: \
 ``
npm i --save-dev akriunit
 ``
 3. Create a directory, preferrably in the root of your project, to contain all your test files. Note that akriunit does not search recursively for test files - any and all test files must be flat in the same directory.
 4. In your test JavaScript files, import TestCase from akriunit/src/TestCase.js. Use this as the parent of your test class.
 5. In your test class, write public methods testing your source methods and assert their outcome using any of the following built-in assertions:
  - `TestCase.assertTrue` - evaluates a value as equal to true
  - `TestCase.assertFalse` - evaluates a value as equal to false
  - `TestCase.assertTruthy` - asserts a value as truthy as defined by ES2026
  - `TestCase.assertFalsy` - asserts a value as falsy as defined by ES2026
  - `TestCase.assertThrows` - asserts that a callback function throws an error, optionally checking against a message
  6. Run `npm run akriunit {your test directory}` to run AkriUnit on all tests in the provided directory. You can provide a specific file name as a second argument to run only that test file.