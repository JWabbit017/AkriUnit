export class TestCase {
  successes = 0;
  failiures = [];

  activeTestFn;

  srcClass = {};
  srcMethods = [];
  coveredSrcMethods = [];
  uncoveredSrcMethods = [];
  
  disallowedMethods = [
    "constructor",
    "__defineGetter__",
    "__defineSetter__",
    "hasOwnProperty",
    "__lookupGetter__",
    "__lookupSetter__",
    "__proto__",
    "isPrototypeOf",
    "propertyIsEnumerable",
    "toString",
    "valueOf",
    "toLocaleString",
    "test",
    "fail",
    "ok",
    "assertEquals",
    "assertFalse",
    "assertTrue",
    "assertThrows"
  ]

  constructor(srcClass = {}) {
    if (typeof this?.setUp === "function") this.setUp();

    this.srcMethods = this.#getMethods(srcClass);
    
    this.test();
  }

  async test() {
    for (const method of this.#getMethods(this)) {
      this.activeTestFn = method;

      for (const srcMethod of this.srcMethods) {
        if (String(this[method]).match(srcMethod + '()')) {
          this.coveredSrcMethods.push(srcMethod);
        }
      }

      await this[method]();
    }

    for (const method of this.srcMethods) {
      if (!this.coveredSrcMethods.includes(method)) {
        this.uncoveredSrcMethods.push(method);
      }
    }

    // intended to be captured by test runner file through stdout, not printed to terminal
    console.log(
      JSON.stringify({
        successes: this.successes,
        failiures: this.failiures,
        uncovered: this.uncoveredSrcMethods
      })
    );

    if (typeof this?.tearDown === "function") this?.tearDown();
  }

  #getMethods(object) {
    const methods = Object.getOwnPropertyNames(
      Object.getPrototypeOf(object) ?? object
    );

    methods.filter(value => typeof this[value] === "function");

    return methods.filter(value => !this.disallowedMethods.includes(value));
  }

  fail(
    err = "UNKNOWN - If invoking AkriTestCase.fail yourself, always add a message",
  ) {
    this.failiures.push(`${this.activeTestFn}: ${new Error(err)?.stack}`);
  }

  ok() {
    this.successes++;
  }

  assertEquals(actual, expected) {
    try {
      if (actual !== expected) {
        return this.fail(`Failed to assert that '${actual}' equals expected '${expected}'`);
      }
    } catch (err) {
      return this.fail(err);
    }

    return this.ok();
  }

  assertTrue(arg) {
    return this.assertEquals(arg, true);
  }

  assertFalse(arg) {
    return this.assertEquals(arg, false);
  }

  async assertThrows(fn, message = null) {
    if (typeof fn !== "function") {
      return this.fail(funcName, 'Argument "fn" must be a callback');
    }

    let pass;

    try {
      await fn();
    } catch (err) {
      pass = true;

      if (message !== null && err !== message) {
        return this.fail(
          `Failed to assert that exception '${err}' matches expected exception '${message}'`,
        );
        pass = false;
      }
    } finally {
      if (!pass) {
        return this.fail(`Failed to assert that this test throws an exception`);
      }

      return this.ok();
    }
  }
}
