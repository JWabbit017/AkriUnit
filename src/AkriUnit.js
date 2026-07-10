import { access, constants, readdir, rm, writeFile } from "node:fs/promises";
import { exec } from "node:child_process";
import { exit } from "node:process";
import { promisify } from "node:util";

export class AkriUnit {
  successes = 0;
  failiures = [];

  path;
  filter;

  startTime;

  constructor(filter = null) {
    this.startTime = Date.now();
    this.filter = filter;
  }

  async fail(err) {
    console.error(err instanceof Error ? err : new Error(err));
    exit(1);
  }

  async executeTests(path) {
    await this.setPath(path);

    await this.runFiles();

    await this.testReport();
  }

  async setPath(path) {
    try {
      if (!path || typeof path !== "string") {
        throw new TypeError("Argument #1 (path) must not be empty");
      }

      await access(path, constants.R_OK);
    } catch (err) {
      this.fail(err);
    }

    this.path = path;
  }

  async testReport() {
    if (this.failiures.length == 0) {
      console.log("OK");

      await this.deleteFailReportFile();
    } else {
      this.outputFailReport();
    }

    console.log(
      `AkriUnit executed with ${this.successes} passed, ${this.failiures.length} failiures.`,
    );

    console.log(`Finished in ${(Date.now() - this.startTime) / 1000}s`);
  }

  outputFailReport() {
    let failstr = "AkriUnit test failiure report:\n\n";

    for (const fail of this.failiures) {
      console.error("--" + fail);
      failstr += fail + "\n\n";
    }

    console.error("Failiures!");

    this.generateFailReportFile(failstr);

    console.error("Generated fail report at " + `${this.path}/aureport.txt`);
  }

  async deleteFailReportFile() {
    await rm(this.path + "/aureport.txt", { force: true });
  }

  async generateFailReportFile(fails = "") {
    await writeFile(`${this.path}/aureport.txt`, fails);
  }

  updateTotalStats(stdout, stderr, file) {
    if (stderr) {
      throw new Error(stderr);
    }

    try {
      let newStats = this.decodeFileOutput(stdout);

      this.failiures = this.failiures.concat(newStats.failiures);

      this.successes += newStats.successes;
    } catch (err) {
      console.fail(
        err ??
          `Output of test file ${file} could not be parsed. Please make sure you instantiate your test class at the end of the file.`,
      );
    }
  }

  decodeFileOutput(stdout) {
    const newStats = JSON.parse(stdout);

    if (
      typeof newStats?.successes !== "number" ||
      typeof newStats?.failiures !== "object"
    ) {
      throw new Error(
        "File passed valid JSON data, but not in the correct format. Please ensure your test class extends AkriUnit's TestCase class.",
      );
    }

    return newStats;
  }

  async runFiles() {
    const testFiles = await readdir(this.path);

    for (const file of testFiles) {
      if (!file.match(".js")) {
        continue;
      }

      const name = file.substr(file.length - 3, 3);

      if (typeof this.filter === "string" && this.filter !== "") {
        if (!file.match(this.filter) && !name.match(this.filter)) {
          continue;
        }
      }

      const promiseExec = promisify(exec);

      const { stdout, stderr } = await promiseExec(`node ${this.path}/${file}`);

      this.updateTotalStats(stdout, stderr, file);
    }
  }
}
