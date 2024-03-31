#!/usr/bin/env node

import fs from "node:fs"
import path from "node:path"

import { defineCommand, runMain } from "citty"

import { type SelectorFiles, findDuplicatesInFiles } from "./program.js"

const { version, description } = JSON.parse(fs.readFileSync(path.resolve("package.json"), "utf-8"))

const report = (selectorFiles: SelectorFiles) => {
  const duplicateClassSelectors = Object.keys(selectorFiles)
  if (duplicateClassSelectors.length === 0) {
    console.log("No duplicate class selector found")
    return
  }

  console.log(`Found ${duplicateClassSelectors.length} duplicated css selector`)
  console.log("")

  duplicateClassSelectors.forEach(classSelector => {
    const files = selectorFiles[classSelector]!

    console.log(`Class selector ".${classSelector}" defined in ${files.size} files`)
    for (const file of files) console.log(file)
    console.log("")
  })

  process.exit(1)
}

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
    report(duplicates)
  },
})

runMain(main)
