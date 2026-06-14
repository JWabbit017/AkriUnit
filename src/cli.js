#!/usr/bin/env node

import { AkriUnit } from "./AkriUnit.js";

new AkriUnit(process.argv[2] ?? null, process.argv[3] ?? null);
