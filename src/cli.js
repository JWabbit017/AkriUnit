#!/usr/bin/env node

import { TestRunner } from "./TestRunner.js";
import { exit } from "node:process";
import packageData from "../package.json" with { type: "json" };

if (process.argv.includes('-v')) {
  console.log(`AkriUnit v${packageData.version} by JM Janszen`);
  exit(0);
}

new TestRunner(process.argv[3] ?? null).run(process.argv[2] ?? null);
