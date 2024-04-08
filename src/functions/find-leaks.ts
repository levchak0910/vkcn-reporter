import type { FileSelector } from "../models/FileSelector.js"
import type { SelectorsReport } from "../models/SelectorsReport.js"

import { replenishSetList } from "../utils/list.js"

export const findLeaks = (fileSelectors: FileSelector[]): SelectorsReport => {
  const globalSelectorsReport: SelectorsReport = {}
  const modifierSelectorsReport: SelectorsReport = {}

  fileSelectors.forEach(fileSelector => {
    fileSelector.selectors.forEach(selector => {
      const classSelectors = selector.split(".")

      // case 1: vkcn element with modifiers
      if (classSelectors[1]?.includes("--")) {
        const [, , ...modifierSelectors] = classSelectors

        modifierSelectors.forEach(modifier => {
          replenishSetList(modifierSelectorsReport, modifier, fileSelector.filePath)
        })
      }

      // case 2: nested modifiers
      else if (classSelectors[0] === "&") {
        const [, ...modifierSelectors] = classSelectors

        modifierSelectors.forEach(modifier => {
          replenishSetList(modifierSelectorsReport, modifier, fileSelector.filePath)
        })
      }

      // case 3: global class selector
      else if (classSelectors[0] === "") {
        classSelectors.slice(1).forEach(classSelector => {
          replenishSetList(globalSelectorsReport, classSelector, fileSelector.filePath)
        })
      }

      // case X: unhandled
      else throw new Error("UNHANDLED CASE! PLEASE REPORT A NEW ISSUE.")
    })
  })

  const leakEntries = Object.entries(modifierSelectorsReport)
    .map(([selector, files]) => {
      const globalSelectors = globalSelectorsReport[selector]

      if (globalSelectors) {
        globalSelectors.forEach(gs => files.add(gs))
      }

      return [selector, files] as const
    })
    .filter(([, files]) => files.size > 1)

  return Object.fromEntries(leakEntries)
}
