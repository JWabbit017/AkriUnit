import { access, constants, readdir, rm, writeFile } from "node:fs/promises";
import { exec } from "node:child_process";
import { exit } from "node:process";
import { promisify } from "node:util";
import path from "node:path";

export class TestRunner {
  successes = [];
  failures = {};

  testDir;
  filter;

  startTime;

  constructor(filter = null) {
    this.startTime = Date.now();
    this.filter = filter;
  }

  fail(err) {
    console.error(err instanceof Error ? err : new Error(err));
    exit(1);
  }

  async run(testDir) {
    await this.setDir(testDir);

    await this.runFiles();

    await this.testReport();
  }

  async setDir(testDir) {
    try {
      if (!testDir || typeof testDir !== "string") {
        throw new TypeError("Argument #1 (testDir) must be a filled string");
      }

      await access(testDir, constants.R_OK);
    } catch (err) {
      this.fail(err);
    }

    this.testDir = testDir;
  }

  async testReport() {
    if (this.suiteEmpty()) {
      console.warn("No tests found!");
      return;
    }
    
    for (const method of this.successes) {
      console.log(method + " ✓");
    }

    for (const method in this.failures) {
      console.error(method + " X");
    }

    console.log("");

    const reportPath = path.join(this.testDir, 'aureport.txt');
    
    if (this.suiteSuccessful()) {
      console.log("OK");

      await this.deleteFailReportFile(reportPath);
    } else {
      this.outputFailReport(reportPath);

      process.exitCode = 1;
    }

    console.log(
      `${this.successes.length} passed, ${this.amountOfFailures()} failures.`,
    );

    const timeDiffSeconds = (Date.now() - this.startTime) / 1000;

    console.log(`Finished in ${timeDiffSeconds}s`);
  }

  outputFailReport(reportPath) {
    let failstr = "";

    for (const fail in this.failures) {
      failstr += `\n--${fail}\n${this.failures[fail]}\n`;
    }

    console.error("Failures!");
    
    this.generateFailReportFile(failstr, reportPath);

    console.error(`Generated fail report at ${reportPath}`);
  }
  
  amountOfFailures() {
    return Object.keys(this.failures).length;
  }

  suiteSuccessful() {
    return this.amountOfFailures() === 0;
  }

  suiteEmpty() {
    return this.successes === 0 && this.suiteSuccessful();
  }

  async deleteFailReportFile(reportPath) {
    await rm(reportPath, { force: true });
  }

  async generateFailReportFile(fails = "", reportPath) {
    await writeFile(reportPath, fails);
  }

  updateTotalStats(stdout, stderr, file) {
    if (stderr) {
      this.fail(stderr);
    }

    try {
      let newStats = this.decodeFileOutput(stdout);

      Object.assign(this.failures, newStats.failures);

      this.successes = this.successes.concat(newStats.successes);
    } catch (err) {
      this.fail(
        err ??
          `Output of test file ${file} could not be parsed. Please make sure you instantiate your test class at the end of the file.`,
      );
    }
  }

  decodeFileOutput(stdout) {    
    const newStats = JSON.parse(stdout);

    if (
      Array.isArray(newStats?.succcesses) ||
      typeof newStats?.failures !== "object"
    ) {
      throw new Error(
        this.fail("File passed valid JSON data, but not in the correct format. Please ensure your test class extends AkriUnit's TestCase class.")
      );
    }

    return newStats;
  }

  async runFiles() {
    const testFiles = await readdir(this.testDir);

    for (const file of testFiles) {
      if (!file.endsWith(".js")) {
        continue;
      }

      if (typeof this.filter === "string" && this.filter !== "") {
        const name = file.slice(0, -3);
        
        if (this.filter !== file && this.filter !== name) {
          continue;
        }
      }

      const filePath = path.join(this.testDir, file);

      const promiseExec = promisify(exec);

      const { stdout, stderr } = await promiseExec(`node ${filePath}`);

      this.updateTotalStats(stdout, stderr, file);
    }
  }
}
