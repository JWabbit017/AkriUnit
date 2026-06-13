"use strict";

import { access, constants, readdir, writeFile } from "node:fs/promises";
import { exec, execFile } from "node:child_process";
import { exit } from "node:process";

const path = process.argv[2];

const startTime = Date.now();

var failiures = [];
var successes = 0;
var warnings = [];

var hasExecuted = false;

try {
  await access(path, constants.R_OK | constants.W_OK);
}
catch(err) {
  console.error(err);
  exit();
}

async function generateTerminalOutput() {
  await setTimeout(() => {
    if (failiures.length == 0) {
      console.log("OK");
    } else {
      console.warn("Failiures!");
    }

    console.log(
      `AkriUnit executed with ${successes} passed, ${failiures.length} failiures and ${warnings.length} warnings.`,
    );
    console.log(`Finished in ${(endTime - startTime) / 100}s`);
  }, 500);
}

async function unitRun() {
  const testFiles = await readdir(path);

  for (const file of testFiles) {
    if (!file.match(".js")) {
      continue;
    }

    const name = file.slice(0, file.length - 3);

    await exec(`node ${path}/${file}`, async function (err, stdout, stderr) {
      const newStats = JSON.parse(stdout);

      for (const fail of newStats.failiures) {
        failiures.push(fail);
      }

      for (const warn of newStats.warnings) {
        warnings.push(warn);
      }

      successes += newStats.successes;
    });
  }

  hasExecuted = true;

  return true;
}

await unitRun();

const endTime = Date.now();

// this whole shebang because exec does not fulfill its promise when the file is done executing, but already when it starts it seems
// and i cant be arsed to whip up a more elegant solution
const checkForCompletion = setInterval(async () => {
  if (hasExecuted) {
    await generateTerminalOutput();
    checkForCompletion.close();
  }
}, 100);