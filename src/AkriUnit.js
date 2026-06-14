import { access, constants, readdir, writeFile } from "node:fs/promises";
import { exec } from "node:child_process";
import { exit } from "node:process";

export class AkriUnit {
  successes = 0;
  failiures = [];
  warnings = [];

  path;
  filter;

  startTimeStamp;

  #hasExecutedRun = false;

  constructor(path = null, filter = null) {
    this.startTimeStamp = Date.now();
    this.filter = filter;
    
    this.#executeTests(path);
  }

  async #executeTests(path) {
    await this.#setPath(path);

    await this.#run();

    await this.#reportAndClean();
  }

  async #setPath(path) {
    try {
      if (!path) {
        throw new Error("ERROR: Argument #1 (path) must not be empty");
      }
      
      await access(path, constants.R_OK | constants.W_OK);
    }
    catch(err) {
      console.error(err);
      exit(1);
    }

    this.path = path;
  }

  #testReport() {
    if (this.failiures.length == 0) {
      console.log("OK");
    } else {
      for (const fail of this.failiures) {
        console.log("--" + fail);
      }

      console.log("Failiures!");
    }

    console.log(
      `AkriUnit executed with ${this.successes} passed, ${this.failiures.length} failiures and ${this.warnings.length} warnings.`,
    );

    console.log(`Finished in ${(Date.now() - this.startTimeStamp) / 100}s`);
  }

  async #updateTotalStats(error, stdout, stderr) {
    try {
      const newStats = JSON.parse(stdout);

      if (
        !newStats?.successes ||
        !newStats?.failiures ||
        !newStats?.warnings
      ) {
        console.trace("stdout passed valid JSON data, but not in the correct format. Please ensure your test class extends AkriUnit's TestCase class.");
        exit(1);
      }

      // the following lines are inside this try block because newStats loses definition after the catch block, even if it didn't execute said catch. Why???
      
      this.failiures = this.failiures.concat(newStats.failiures);

      this.warnings = this.warnings.concat(newStats.warnings);

      this.successes += newStats.successes;
    }
    catch(err) {
      console.trace("ERROR: Output of test file " + file + " could not be parsed. Please make sure you instantiate your test class at the end of the file.");
      exit(1);
    }
  }

  async #run() {
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
  
      await exec(`node ${this.path}/${file}`, async (err, stdout, stderr) => {await this.#updateTotalStats(err, stdout, stderr);});
    }

    this.#hasExecutedRun = true;
  }

  #reportAndClean() {
    const isCompleted = setInterval(() => {
      if (this.#hasExecutedRun) {
        this.#testReport();
        isCompleted.close();
      }
    }, 100);
  }
}