import { describe, expect, it } from "vitest"

import { findViolationsInFiles } from "../../src/program"

const getPath = file => `tests/mock/${file}`
const MAIN = getPath("main-component.vue")

describe("find duplicates", () => {
  it("don't find duplicates", async () => {
    const { duplicates } = await findViolationsInFiles({ files: [MAIN] })

    expect(duplicates).toEqual({})
  })

  it("find duplicate element in vue and scss files", async () => {
    const { duplicates } = await findViolationsInFiles({
      files: [MAIN, getPath("main-component--scss.scss")],
    })

    expect(duplicates).toEqual({
      "main-component--scss": new Set([MAIN, getPath("main-component--scss.scss")]),
    })
  })

  it("find duplicate element in vue and css files", async () => {
    const { duplicates } = await findViolationsInFiles({
      files: [MAIN, getPath("main-component--css.css")],
    })

    expect(duplicates).toEqual({
      "main-component--css": new Set([MAIN, getPath("main-component--css.css")]),
    })
  })

  it("find duplicate element in all vue files", async () => {
    const { duplicates } = await findViolationsInFiles({
      files: [getPath("*.vue")],
      ignore: [getPath("main-component--css.css"), getPath("main-component--scss.scss")],
    })

    expect(duplicates).toEqual({
      "main-component--scss": new Set([MAIN, getPath("duplicate-component.vue")]),
      "main-component--css": new Set([MAIN, getPath("duplicate-component.vue")]),
    })
  })

  it("find duplicate element in vue, scss and css files", async () => {
    const { duplicates } = await findViolationsInFiles({
      files: [MAIN, getPath("main-component--scss.scss"), getPath("main-component--css.css")],
    })

    expect(duplicates).toEqual({
      "main-component--scss": new Set([MAIN, getPath("main-component--scss.scss")]),
      "main-component--css": new Set([MAIN, getPath("main-component--css.css")]),
    })
  })

  it("find duplicate element in all vue, scss and css files, but ignore specific file", async () => {
    const { duplicates } = await findViolationsInFiles({
      files: [getPath("*.{vue,scss,css}")],
      ignore: [getPath("main-component--css.css"), getPath("duplicate-component.vue")],
    })

    expect(duplicates).toEqual({
      "main-component--scss": new Set([MAIN, getPath("main-component--scss.scss")]),
    })
  })
})

describe("find leaks", () => {
  it("don't find leaks", async () => {
    const { leaks } = await findViolationsInFiles({ files: [MAIN] })

    expect(leaks).toEqual({})
  })

  it("find leaks: modifier 'scss-mod' in vue and scss files", async () => {
    const { leaks } = await findViolationsInFiles({
      files: [MAIN, getPath("scss-mod.scss")],
    })

    expect(leaks).toEqual({
      "scss-mod": new Set([MAIN, getPath("scss-mod.scss")]),
    })
  })

  it("find leaks: double modifier 'scss-mod-double' in vue and scss files", async () => {
    const { leaks } = await findViolationsInFiles({
      files: [MAIN, getPath("scss-mod-double.scss")],
    })

    expect(leaks).toEqual({
      "scss-mod-double": new Set([MAIN, getPath("scss-mod-double.scss")]),
    })
  })

  it("find leaks: modifier 'scss-mod-nested' in vue and scss files", async () => {
    const { leaks } = await findViolationsInFiles({
      files: [MAIN, getPath("scss-mod-nested.scss")],
    })

    expect(leaks).toEqual({
      "scss-mod-nested": new Set([MAIN, getPath("scss-mod-nested.scss")]),
    })
  })

  it("find leaks: double modifier 'scss-mod-nested-double' in vue and scss files", async () => {
    const { leaks } = await findViolationsInFiles({
      files: [MAIN, getPath("scss-mod-nested-double.scss")],
    })

    expect(leaks).toEqual({
      "scss-mod-nested-double": new Set([MAIN, getPath("scss-mod-nested-double.scss")]),
    })
  })

  it("find leaks: modifier 'css-mod' in vue and css files", async () => {
    const { leaks } = await findViolationsInFiles({
      files: [MAIN, getPath("css-mod.css")],
    })

    expect(leaks).toEqual({
      "css-mod": new Set([MAIN, getPath("css-mod.css")]),
    })
  })

  it("find leaks: double modifier 'css-mod-double' in vue and css files", async () => {
    const { leaks } = await findViolationsInFiles({
      files: [MAIN, getPath("css-mod-double.css")],
    })

    expect(leaks).toEqual({
      "css-mod-double": new Set([MAIN, getPath("css-mod-double.css")]),
    })
  })

  it("find leaks: modifier 'scss-mod' nested in parent class in vue and scss files", async () => {
    const { leaks } = await findViolationsInFiles({
      files: [MAIN, getPath("scss-mod-parent.scss")],
    })

    expect(leaks).toEqual({
      "scss-mod": new Set([MAIN, getPath("scss-mod-parent.scss")]),
    })
  })

  it("find leaks: modifiers in vue, scss and css files", async () => {
    const { leaks } = await findViolationsInFiles({
      files: [
        MAIN,
        getPath("scss-mod.scss"),
        getPath("scss-mod-double.scss"),
        getPath("scss-mod-nested.scss"),
        getPath("scss-mod-nested-double.scss"),
        getPath("css-mod.css"),
        getPath("css-mod-double.css"),
      ],
    })

    expect(leaks).toEqual({
      "scss-mod": new Set([MAIN, getPath("scss-mod.scss")]),
      "scss-mod-double": new Set([MAIN, getPath("scss-mod-double.scss")]),
      "scss-mod-nested": new Set([MAIN, getPath("scss-mod-nested.scss")]),
      "scss-mod-nested-double": new Set([MAIN, getPath("scss-mod-nested-double.scss")]),
      "css-mod": new Set([MAIN, getPath("css-mod.css")]),
      "css-mod-double": new Set([MAIN, getPath("css-mod-double.css")]),
    })
  })

  it("find leaks: modifiers in all vue, scss and css files, but ignore specific file", async () => {
    const { leaks } = await findViolationsInFiles({
      files: [getPath("*.{vue,scss,css}")],
      ignore: [getPath("scss-mod.scss"), getPath("css-mod.css"), getPath("scss-mod-parent.scss")],
    })

    expect(leaks).toEqual({
      "scss-mod-double": new Set([MAIN, getPath("scss-mod-double.scss")]),
      "scss-mod-nested": new Set([MAIN, getPath("scss-mod-nested.scss")]),
      "scss-mod-nested-double": new Set([MAIN, getPath("scss-mod-nested-double.scss")]),
      "css-mod-double": new Set([MAIN, getPath("css-mod-double.css")]),
    })
  })
})
