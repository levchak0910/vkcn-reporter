#!/usr/bin/env node

import fs from "node:fs"
import path from "node:path"

import { defineCommand, runMain } from "citty"

import { findDuplicatesInFiles } from "./program.js"
import { getReport } from "./report.js"

const { version, description } = JSON.parse(fs.readFileSync(path.resolve("package.json"), "utf-8"))

const main = defineCommand({
  meta: {
    name: "vkcn-reporter",
    version,
    description,
  },
  args: {
    files: {
      type: "positional",
      description: "files global",
      required: true,
    },
    ignore: {
      type: "string",
      description: "Skip files",
      alias: ["i"],
    },
  },
  async run({ args }) {
    const files = args.files.split(" ")

    const ignoreArg = args.ignore ?? ""
    const ignore =
      typeof ignoreArg === "string" ? ignoreArg.split(" ") : (ignoreArg as string[]).flatMap(s => s.split(" "))

    const duplicates = await findDuplicatesInFiles({ files, ignore })
    const [report, code] = getReport(duplicates)

    console.log(report)
    process.exit(code)
  },
})

runMain(main)
