export class TestCase {
  failiures = [];
  warnings = [];
  successes = 0;
  activeTestFn = '';
  #ownMethods = [
    "constructor",
    "fail",
    "ok",
    "assertTrue",
    "assertTruthy",
    "assertFalse",
    "assertFalsy",
    "assertEquals",
    "assertThrows",
  ];

  constructor() {
    return this.test();
  }

  test() {
    for (const method of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {      
      if (this.#ownMethods.includes(method)) {
        continue;
      }

      if (!method.match(/^(hf)|(ef)/)) {
        continue;
      }

      if (!this[method] || typeof this[method] !== "function") {
        continue;
      }

      this.activeTestFn = method;

      try {
        this[method]();
      }
      catch(err) {
        this.fail(err);
      }
    }

    // intended to be captured by test runner file through stdout, not printed to terminal
    console.log(JSON.stringify({
      failiures: this.failiures,
      successes: this.successes,
      warnings: this.warnings
    }))
  }

  fail(err = "UNKNOWN - If invoking AkriTestCase.fail yourself, always add a message") {
    this.failiures.push(`${this.activeTestFn}: ${err}`);
    console.trace(`${this.activeTestFn}: ${err}`);
    return false;
  }

  ok() {
    this.successes++;
    return true;
  }

  assertTrue(arg) {
    if (!(arg === true)) {
      return this.fail(`Failed to assert that ${arg} equals true`);
    }

    return this.ok();
  }

  assertFalse(arg) {
    if (arg === true) {
      return this.fail(`Failed to assert that ${arg} equals false`);
    }

    return this.ok();
  }

  assertTruthy(arg) {
    if (!arg) {
      return this.fail(`Failed to assert that ${arg} is truthy`);
    }

    return this.ok();
  }

  assertFalsy(arg) {
    if (arg) {
      return this.fail(`Failed to assert that ${arg} is falsy`);
    }

    return this.ok();
  }

  assertEquals(arg1, arg2) {
    try {
      if (arg1 !== arg2) {
        return this.fail(`Failed to assert that ${arg1} equals ${arg2}`);
      }
    } catch (err) {
      return this.fail(err);
    }

    return this.ok();
  }

  assertThrows(fn, message = null) {
    if (typeof fn !== "function") {
      this.fail(funcName, 'Argument "fn" must be a function');
    }

    let pass = false;

    try {
      fn();
    } 
    catch (err) {
      pass = true;
      
      if (message !== null && err !== message) {
        return this.fail(`Failed to assert that exception '${err}' matches expected exception '${message}'`);
        pass = false;
      }
    } 
    finally {
      if (!pass) {
        return this.fail(
          `Failed to assert that this test throws an exception`,
        );
      }

      return this.ok();
    }
  }
}
