import { TestCase } from "../src/index.js";

function isEmpty(arr) {
  if (!(arr instanceof Array)) {
    throw new TypeError("Argument #1 (arr) should be of type Array, " + typeof arr + " found.");
  }

  return arr.length == 0;
};

class TestFailTest extends TestCase {
  hfIsEmpty() {
    const array = [];
    const fullArray = ["simon", "jarrett"];

    const result1 = isEmpty(array);
    const result2 = isEmpty(fullArray);

    this.assertFalse(result1);
    this.assertFalse(result2);
  }

  efIsEmpty() {
    const notAnArray = [];

    const fn = () => {
      isEmpty(notAnArray);
    };

    this.assertThrows(fn, null);
  }
}

new TestFailTest();
