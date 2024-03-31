import type { SelectorFiles } from "./program.js"

const renderReport = (lines: string[]): string => lines.join("\n")

export const getReport = (selectorFiles: SelectorFiles): [string, number] => {
  const lines: string[] = []

  const duplicateClassSelectors = Object.keys(selectorFiles)
  if (duplicateClassSelectors.length === 0) {
    lines.push("No duplicate class selector found")
    return [renderReport(lines), 0]
  }

  lines.push(`Found ${duplicateClassSelectors.length} duplicated css selector`)
  lines.push("")

  duplicateClassSelectors.forEach(classSelector => {
    const files = selectorFiles[classSelector]!

    lines.push(`Class selector ".${classSelector}" defined in ${files.size} files`)
    for (const file of files) lines.push(file)
    lines.push("")
  })

  return [renderReport(lines), 1]
}
