import path from "path"

import { glob } from "glob"

import type { FileSelector } from "./models/FileSelector.js"
import type { SelectorsReport } from "./models/SelectorsReport.js"

import {
  extractClassSelectorsFromStyleFile,
  extractClassSelectorsFromVueFile,
} from "./functions/extract-classes-from-file.js"
import { findDuplicates } from "./functions/find-duplicates.js"
import { findLeaks } from "./functions/find-leaks.js"

type Options = {
  files: string[]
  ignore?: string[]
}

const handlers: Record<string, (arg: string) => Promise<string[]>> = {
  ".css": extractClassSelectorsFromStyleFile,
  ".scss": extractClassSelectorsFromStyleFile,
  ".vue": extractClassSelectorsFromVueFile,
}

type Violations = Record<"duplicates" | "leaks", SelectorsReport>

export const findViolationsInFiles = async (options: Options): Promise<Violations> => {
  const files = await Promise.all(
    options.files.map(filesGlob =>
      glob(filesGlob, {
        ignore: ["node_modules/**", "dist/**", ...(options.ignore ?? [])],
      }),
    ),
  )

  const fileSelectors = await Promise.all(
    files.flat().map<Promise<FileSelector>>(filePath => {
      const { ext } = path.parse(filePath)
      const handler = handlers[ext]

      if (!handler) {
        console.log(`Extension "${ext}" is not supported`)
        return Promise.resolve({ filePath, selectors: [] })
      }

      return handler(filePath).then(selectors => ({ filePath, selectors }))
    }),
  )

  const duplicates = findDuplicates(fileSelectors)
  const leaks = findLeaks(fileSelectors)

  return {
    duplicates,
    leaks,
  }
}
