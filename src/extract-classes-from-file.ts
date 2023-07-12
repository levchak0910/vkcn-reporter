import { readFile } from "fs/promises"
import { parse } from "vue/compiler-sfc"

import { extractClassSelectorsFromStyleSource } from "./extract-classes-from-style"
import { uniqArray } from "./array"

export const extractClassSelectorsFromStyleFile = async (filePath: string): Promise<string[]> => {
  const source = await readFile(filePath, "utf-8")
  return await extractClassSelectorsFromStyleSource(source)
}

export const extractClassSelectorsFromVueFile = async (filePath: string): Promise<string[]> => {
  const source = await readFile(filePath, "utf-8")
  const sfc = parse(source)
  const classSelectors = await Promise.all(
    sfc.descriptor.styles.map(style => extractClassSelectorsFromStyleSource(style.content)),
  )
  return uniqArray(classSelectors.flat())
}
