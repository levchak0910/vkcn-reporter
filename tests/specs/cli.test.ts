import { execSync } from "node:child_process"

import { beforeAll, describe, expect, it } from "vitest"

const executeFailingCommand = (command: string): string => {
  let output: string | Error = new Error("should throw")
  try {
    execSync(command)
  } catch (error) {
    output = error.stdout.toString()
  }

  expect(output).toBeTypeOf("string")
  return output as string
}

describe("cli", () => {
  beforeAll(() => {
    execSync("pnpm build")
  })

  it("test wrong path", async () => {
    const stdout = execSync("node dist/cli.js wrong-path")

    expect(stdout.toString()).toContain("No duplicate class selector found")
  })

  it("test correct path", async () => {
    const output = executeFailingCommand("node dist/cli.js tests/mock/*.{css,scss,vue}")

    expect(output).toContain("foo-component--bar")
    expect(output).toContain("tests/mock/foo-component.vue")
    expect(output).toContain("tests/mock/foo-component.scss")
    expect(output).toContain("tests/mock/foo-component.css")

    expect(output).toContain("foo-component--uniq-css")
    expect(output).toContain("tests/mock/foo-component.css")
    expect(output).toContain("tests/mock/bar-component.css")

    expect(output).toContain("foo-component--uniq-scss")
    expect(output).toContain("tests/mock/foo-component.scss")
    expect(output).toContain("tests/mock/bar-component.css")

    expect(output).toContain("foo-component--uniq-vue-css")
    expect(output).toContain("tests/mock/foo-component.vue")
    expect(output).toContain("tests/mock/bar-component.css")

    expect(output).toContain("foo-component--uniq-vue-scss")
    expect(output).toContain("tests/mock/foo-component.vue")
    expect(output).toContain("tests/mock/bar-component.css")
  })

  it("test correct path with ignore", async () => {
    const output = executeFailingCommand("node dist/cli.js tests/mock/*.{css,scss,vue} -i tests/mock/bar-component.css")

    expect(output).toContain("foo-component--bar")
    expect(output).toContain("tests/mock/foo-component.vue")
    expect(output).toContain("tests/mock/foo-component.scss")
    expect(output).toContain("tests/mock/foo-component.css")
  })
})
