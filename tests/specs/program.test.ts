import { describe, expect, it } from "vitest"

import { findDuplicatesInFiles } from "../../src/program"

describe("findDuplicatesInFiles", () => {
  it("files", async () => {
    const duplicates = await findDuplicatesInFiles({
      files: ["tests/mock/*.{css,scss,vue}"],
    })

    expect(duplicates).toEqual({
      "foo-component--bar": new Set([
        "tests/mock/foo-component.vue",
        "tests/mock/foo-component.scss",
        "tests/mock/foo-component.css",
      ]),
      "foo-component--uniq-css": new Set(["tests/mock/foo-component.css", "tests/mock/bar-component.css"]),
      "foo-component--uniq-scss": new Set(["tests/mock/foo-component.scss", "tests/mock/bar-component.css"]),
      "foo-component--uniq-vue-css": new Set(["tests/mock/foo-component.vue", "tests/mock/bar-component.css"]),
      "foo-component--uniq-vue-scss": new Set(["tests/mock/foo-component.vue", "tests/mock/bar-component.css"]),
    })
  })

  it("ignore", async () => {
    const duplicates = await findDuplicatesInFiles({
      files: ["tests/mock/*.{css,scss,vue}"],
      ignore: ["tests/mock/bar-component.css"],
    })

    expect(duplicates).toEqual({
      "foo-component--bar": new Set([
        "tests/mock/foo-component.vue",
        "tests/mock/foo-component.scss",
        "tests/mock/foo-component.css",
      ]),
    })
  })
})
