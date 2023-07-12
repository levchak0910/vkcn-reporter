import makeCli from "make-cli"

import { type SelectorFiles, findDuplicatesInFiles } from "./program"

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
  name: "s",
  version: "1",
  usage: "Usage description here",
  arguments: "<files>",
  options: [
    {
      name: "-i, --ignore <ignore>",
      description: "Skip files",
    },
  ],
  action: async (files: string, options: Record<string, string>) => {
    const duplicates = await findDuplicatesInFiles({
      files: files.split(","),
      ignore: (options.ignore ?? "").split(","),
    })

    report(duplicates)
  },
})
