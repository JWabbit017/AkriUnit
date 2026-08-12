import { TestCase } from "../src/index.js";
import { isEmpty, a } from "../src/src_methods.js";

class TestTest extends TestCase {
  hfIsEmpty() {
    const array = [];
    const fullArray = ["simon", "jarrett"];

    const result1 = isEmpty(array);
    const result2 = isEmpty(fullArray);

    this.assertTrue(result1);
    this.assertFalse(result2);
  }

  efIsEmpty() {
    const notAnArray = 17;

    const fn = () => {
      isEmpty(notAnArray);
    };

    this.assertThrows(fn, null);
  }

  hfA() {
    this.assertEquals(a(), "hi");
  }
}

new TestTest({isEmpty, a});
