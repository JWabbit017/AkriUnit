import { TestCase } from "akriunit";
import { src } from "../src/src_methods.js";

class ArrayPrototypeTest extends TestCase {  
  testhfIsEmpty() {
    const array = [];
    const fullArray = ["simon", "jarrett"];

    const result1 = src.isEmpty(array);
    const result2 = src.isEmpty(fullArray);

    this.assertTrue(result1);
    this.assertFalse(result2);
  }

  testefIsEmpty() {
    const notAnArray = 593;

    const fn = () => {
      src.isEmpty(notAnArray);
    };

    this.assertThrows(fn, null);
  }
}

new ArrayPrototypeTest();
