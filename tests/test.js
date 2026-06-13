import { TestCase } from "../src/TestCase.js"

function isEmpty(arr) {
  if (!(arr instanceof Array)) {
    throw new TypeError("Argument #1 (arr) should be of type Array, " + typeof arr + " found.");
  }

  return arr.length == 0;
};

class ArrayPrototypeTest extends TestCase {
  hfIsEmpty() {
    const array = [];
    const fullArray = ["lucas", "mooijman"];

    const result1 = isEmpty(array);
    const result2 = isEmpty(fullArray);

    this.assertTrue(result1);
    this.assertFalse(result2);
  }

  efIsEmpty() {
    const notAnArray = 593;

    const fn = () => {
      isEmpty(notAnArray);
    };

    this.assertThrows(fn, null);
  }
}

new ArrayPrototypeTest();
