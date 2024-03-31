#!/usr/bin/env node

import fs from "node:fs"
import path from "node:path"

// @ts-expect-error
import makeCli from "make-cli"

import { type SelectorFiles, findDuplicatesInFiles } from "./program.js"

const { version } = JSON.parse(fs.readFileSync(path.resolve("package.json"), "utf-8"))

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

makeCli({
  name: "vkcn-reporter",
  version,
  usage: `
  
  vkcn-reporter <files> -i <ignore>

  For details please check docs: https://www.npmjs.com/package/@vkcn/reporter#cli-usage
  `,
  arguments: "<files...>",
  options: [
    {
      name: "-i, --ignore <ignore...>",
      description: "Skip files",
    },
  ],
  action: async (files: string[], options: { ignore?: string[] }) => {
    const duplicates = await findDuplicatesInFiles({
      files,
      ignore: options.ignore ?? [],
    })

    report(duplicates)
  },
})
