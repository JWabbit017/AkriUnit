export class TestCase {
  successes = [];
  failures = {};

  activeTestFn;

  constructor() {
    if (typeof this?.setUp === "function") this.setUp();
    
    this.test();
  }

  async test() {
    for (const method of this.#getMethods(this)) {            
      this.activeTestFn = method;

      await this[method]();
    }

    // intended to be captured by test runner file through stdout, not printed to terminal
    console.log(
      JSON.stringify({
        successes: this.successes,
        failures: this.failures,
      })
    );

    if (typeof this?.tearDown === "function") this?.tearDown();
  }

  #getMethods(object) {
    // intentionally not getting prototype to avoid including assertion methods
    let methods = Object.getOwnPropertyNames(
      Object.getPrototypeOf(object)
    );

    methods = methods.filter(value => value !== "constructor");

    // distill to array of only methods
    return methods.filter(value => typeof this[value] === "function");
  }

  #getAssertionIndexedName() {
    let index = 0;
    
    for (const method in this.failures) {
      if (method.match(this.activeTestFn)) index++;
    }

    for (const method of this.successes) {
      if (method.match(this.activeTestFn)) index++;
    }

    return `${this.activeTestFn}#${index}`;
  }

  fail(
    err = "UNKNOWN - If invoking AkriTestCase.fail yourself, always add a message",
  ) {
    this.failures[this.#getAssertionIndexedName()] = err instanceof Error ? err?.stack : new Error(err)?.stack;
  }

  ok() {
    this.successes.push(this.#getAssertionIndexedName());
  }

  assertEquals(actual, expected) {
    try {
      if (actual !== expected) {
        return this.fail(new Error(`Failed to assert that actual '${actual}' equals expected '${expected}'`));
      }
    } catch (err) {
      return this.fail(err);
    }

    this.ok();
  }

  assertTrue(arg) {
    this.assertEquals(arg, true);
  }

  assertFalse(arg) {
    this.assertEquals(arg, false);
  }

  async assertThrows(fn, message = null) {
    if (typeof fn !== "function") {
      return this.fail('Argument "fn" must be a callback');
    }

    try {
      await fn();

      this.fail(new Error(`Failed to assert that this test throws an exception`));
    } catch (err) {
      if (message !== null && err.message !== message) {
        return this.fail(
          new Error(`Failed to assert that exception '${err}' matches expected exception '${message}'`),
        );
      }

      return this.ok();
    }
  }
}
