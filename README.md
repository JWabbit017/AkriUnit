## Note: This was written only for the purpose of introducing students to the concept of unit testing - please don't use this for any serious projects. Consider packages like Jest instead.

## Basic Usage
 1. Ensure you have Node.js v24.0.0 or higher installed on your system.
 
 2. Install as a devDependency of your project with npm: \
 ``
npm i --save-dev akriunit
 ``
 3. Create a directory, preferrably in the root of your project, to contain all your test files. Note that akriunit does not search recursively for test files - any and all test files must be flat in the same directory.
 4. In your test files, import TestCase (`import { TestCase } from "akriunit"`). Use this as the parent of your test class. Note that you may not define your own constructor.
 5. In your test class, write public methods, their names always starting with 'hf' for happy flow or 'ef' for error flow, testing your source methods and assert their outcome using any of the following built-in assertions:
  - `TestCase.assertTrue` - evaluates a value as equal to true
  - `TestCase.assertFalse` - evaluates a value as equal to false
  - `TestCase.assertEquals` - evaluates two values as equal
  - `TestCase.assertThrows` - asserts that a callback function throws an error, optionally checking against a message
  6. Run `npx akriunit {test directory}` to run AkriUnit on all tests in the provided directory. You can optionally provide a specific file name as a second argument to run only that test file.

## Changelog v1.0.0
 - Added bin script, users can now run the test runner through `npx akriunit`
 - Replaced 'main' entrypoint field with 'exports'
 - Package entrypoint now exposes TestCase, which can now be imported as easily as `import { TestCase } from "akriunit"`
 - Removed TestCase.isTruthy
 - Removed TestCase.isFalsy
 - Cleaned up (some of) my lazy code in TestCase & cli
 - Changed published package from raw source to compressed dist