#!/usr/bin/env node

import { AkriUnit } from "./AkriUnit.js";

const testrunner = new AkriUnit(process.argv[3] ?? null);

testrunner.executeTests(process.argv[2] ?? null);
