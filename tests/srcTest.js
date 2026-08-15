import { TestCase } from "../src/index.js";
import { src } from "../src/src_methods.js";

class TestTest extends TestCase {
  hfIsEmpty() {
    const array = [];
    const fullArray = ["simon", "jarrett"];

    const result1 = src.isEmpty(array);
    const result2 = src.isEmpty(fullArray);

    this.assertTrue(result1);
    this.assertFalse(result2);
  }

  efIsEmpty() {
    const notAnArray = 17;

    const fn = () => {
      src.isEmpty(notAnArray);
    };

    this.assertThrows(fn, null);
  }

  hfA() {
    this.assertEquals(src.a(), "hi");
  }
}

new TestTest();
