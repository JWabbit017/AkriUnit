import { TestCase } from "akriunit";
import { src } from "../src/src_methods.js";

class TestFailTest extends TestCase { 
  hfIsEmpty() {
    const array = [];
    const fullArray = ["simon", "jarrett"];

    const result1 = src.isEmpty(array);
    const result2 = src.isEmpty(fullArray);

    this.assertFalse(result1);
    this.assertFalse(result2);
  }

  efIsEmpty() {
    const notAnArray = [];

    const fn = () => {
      src.isEmpty(notAnArray);
    };

    this.assertThrows(fn, null);
  }
}

new TestFailTest();
