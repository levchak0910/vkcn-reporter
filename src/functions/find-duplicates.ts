import type { FileSelector } from "../models/FileSelector.js"
import type { SelectorsReport } from "../models/SelectorsReport.js"

import { replenishSetList } from "../utils/list.js"

export const findDuplicates = (fileSelectors: FileSelector[]): SelectorsReport => {
  const selectorsReport: SelectorsReport = {}

  fileSelectors.forEach(fileSelector => {
    fileSelector.selectors
      .flatMap(selector => selector.split("."))
      .filter(selector => selector.includes("--"))
      .forEach(selector => {
        replenishSetList(selectorsReport, selector, fileSelector.filePath)
      })
  })

  const duplicateEntries = Object.entries(selectorsReport).filter(([, files]) => files.size > 1)
  return Object.fromEntries(duplicateEntries)
}
