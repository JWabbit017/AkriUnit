## Note: AkriUnit was developed only for educational purposes. Modern Node includes its own test runner, which I recommend over AkriUnit for any other use case.

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
  - `TestCase.assertEquals` - evaluates two values as strictly equal
  - `TestCase.assertThrows` - asserts that a callback function throws an error, optionally checking against a message
  6. Be sure to create an instance of your test class at the end of your file. You don't have to do anything with this instance, we just need to run TestCase's constructor.
  7. Run `npx akriunit {test directory}` to run AkriUnit on all tests in the provided directory. You can optionally provide a specific file name as a second argument to run only that test file.

## Changelog v2.0.0
 - '-v' cli argument added to display current version & developer credit
 - TestCase now supports a setUp, tearDown & globalProvider instance method
 - globalProvider, if defined, will pass its return value to every test method of its class
 - Overhauled test data structure to include method name & index of run assertion
 - Test methods must now have a name beginning with 'test'
 - Command-line report overhauled; now displays each test method/assertion with a check or X before evaluation
 - Test file output parses no longer exits the program upon failing
 - Fixed run time being measured in tenths of a second but displayed in seconds
 - Fixed runner asking for test directory write permissions
 - Fixed runner detecting chained extensions (e.g. 'file.js.lowest') as test files
 - Fixed cli file filter checking against the extension instead of the file name (how the hell did I let this get in prod)

P.S. Designed & written exclusively by a human developer <3