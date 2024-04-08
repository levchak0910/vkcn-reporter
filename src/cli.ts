#!/usr/bin/env node

import fs from "node:fs"
import path from "node:path"

import { defineCommand, runMain } from "citty"

import { findViolationsInFiles } from "./program.js"
import { getDuplicatesReport, getLeaksReport } from "./functions/report.js"

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

    const { duplicates, leaks } = await findViolationsInFiles({ files, ignore })

    const [duplicatesReport, duplicatesCode] = getDuplicatesReport(duplicates)
    const [leaksReport, leaksCode] = getLeaksReport(leaks)

    console.log(duplicatesReport)
    console.log(leaksReport)
    process.exit(duplicatesCode || leaksCode)
  },
})

runMain(main)
