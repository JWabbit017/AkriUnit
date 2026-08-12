import { TestCase } from "../src/index.js";
import { isEmpty, a } from "../src/src_methods.js";

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

new TestFailTest({isEmpty, a});
