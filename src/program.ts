import path from "path"

import { glob } from "glob"

import { extractClassSelectorsFromStyleFile, extractClassSelectorsFromVueFile } from "./extract-classes-from-file.js"

export type FileSelectors = {
  filePath: string
  selectors: string[]
}

export type SelectorFiles = Record<string, Set<string>>

const findDuplicates = (fileSelectors: FileSelectors[]) => {
  const selectorFiles: SelectorFiles = {}

  fileSelectors.forEach(fileSelector => {
    fileSelector.selectors.forEach(selector => {
      const files = selectorFiles[selector]

      if (!files) {
        selectorFiles[selector] = new Set([fileSelector.filePath])
      } else {
        files.add(fileSelector.filePath)
      }
    })
  })

  const duplicateEntries = Object.entries(selectorFiles).filter(([, files]) => files.size > 1)
  return Object.fromEntries(duplicateEntries)
}

type Options = {
  files: string[]
  ignore?: string[]
}

const handlers: Record<string, (arg: string) => Promise<string[]>> = {
  ".css": extractClassSelectorsFromStyleFile,
  ".scss": extractClassSelectorsFromStyleFile,
  ".vue": extractClassSelectorsFromVueFile,
}

export const findDuplicatesInFiles = async (options: Options) => {
  const files = await Promise.all(
    options.files.map(filesGlob =>
      glob(filesGlob, {
        ignore: ["node_modules/**", "dist/**", ...(options.ignore ?? [])],
      }),
    ),
  )

  const fileSelectors = await Promise.all(
    files.flat().map<Promise<FileSelectors>>(filePath => {
      const { ext } = path.parse(filePath)
      const handler = handlers[ext]

      if (!handler) {
        console.log(`Extension "${ext}" is not supported`)
        return Promise.resolve({ filePath, selectors: [] })
      }

      return handler(filePath).then(selectors => ({ filePath, selectors }))
    }),
  )

  return findDuplicates(fileSelectors)
}
