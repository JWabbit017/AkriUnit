## Note: This was written only for the purpose of introducing students to npm & the concept of unit testing - please don't use. Consider packages like Jest instead.

## Basic Usage
 1. Ensure you have Node.js v24.0.0 or higher installed on your system.
 
 2. Install as a devDependency of your project with npm: \
 ``
npm i --save-dev akriunit
 ``
 3. Create a directory, preferrably in the root of your project, to contain all your test files. Note that akriunit does not search recursively for test files - any and all test files must be flat in the same directory.
 4. In your test files, import TestCase (`import { TestCase } from "akriunit"`). Use this as the parent of your test class. Note that you may not define your own constructor.
 5. In your test class, write public methods testing your source methods and assert their outcome using any of the following built-in assertions:
  - `TestCase.assertTrue` - evaluates a value as equal to true
  - `TestCase.assertFalse` - evaluates a value as equal to false
  - `TestCase.assertEquals` - evaluates two values as equal
  - `TestCase.assertThrows` - asserts that a callback function throws an error, optionally checking against a message
  6. Be sure to create an instance of your test class at the end of your file. You don't have to do anything with this instance, we just need to run TestCase's constructor.
  7. Run `npx akriunit {test directory}` to run AkriUnit on all tests in the provided directory. You can optionally provide a specific file name as a second argument to run only that test file.

## Changelog v1.0.3
 - Code cleanup in test runner
 - Promisified test file execution - this avoids the possibility of generating a report before all filed have finished running

P.S. Designed & written exclusively by a human developer <3