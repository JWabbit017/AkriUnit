import { TestCase } from "akriunit";
import { isEmpty } from "../src/src_methods.js";

class ArrayPrototypeTest extends TestCase {
  hfIsEmpty() {
    const array = [];
    const fullArray = ["simon", "jarrett"];

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
