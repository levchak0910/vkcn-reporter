import pc from "picocolors"

import type { SelectorsReport } from "../models/SelectorsReport.js"

const renderReport = (lines: string[]): string => lines.join("\n")

const getReport = (
  selectorFiles: SelectorsReport,
  messages: {
    none: string
    title: (amount: number) => string
    line: (selector: string, amount: number) => string
  },
): [string, number] => {
  const lines: string[] = []

  const duplicateClassSelectors = Object.keys(selectorFiles)
  if (duplicateClassSelectors.length === 0) {
    lines.push(messages.none)
    return [renderReport(lines), 0]
  }

  lines.push(messages.title(duplicateClassSelectors.length))
  lines.push("")

  duplicateClassSelectors.forEach(classSelector => {
    const files = selectorFiles[classSelector]!

    lines.push(messages.line(classSelector, files.size))
    for (const file of files) lines.push(`  - ${file}`)
    lines.push("")
  })

  return [renderReport(lines), 1]
}

export const getDuplicatesReport = (selectorFiles: SelectorsReport): [string, number] => {
  return getReport(selectorFiles, {
    none: pc.green("👍 No duplicate class selectors found"),
    title: duplicatesAmount => `❌ Found ${pc.bold(duplicatesAmount)} ${pc.red("duplicated")} class selectors`,
    line: (classSelector, filesAmount) =>
      `Class selector ".${pc.yellow(classSelector)}" defined in ${pc.blue(filesAmount)} files`,
  })
}
export const getLeaksReport = (selectorFiles: SelectorsReport): [string, number] => {
  return getReport(selectorFiles, {
    none: pc.green("👍 No potentially leaking class selectors found"),
    title: leaksAmount => `❌ Found ${pc.bold(leaksAmount)} ${pc.red("potentially leaking")} class selectors`,
    line: (classSelector, filesAmount) =>
      `Class selector ".${pc.yellow(classSelector)}" can potentially leak in ${pc.blue(filesAmount)} files`,
  })
}
