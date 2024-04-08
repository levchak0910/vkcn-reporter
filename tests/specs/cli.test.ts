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

  it("test wrong glob", async () => {
    const stdout = execSync("node dist/cli.js wrong-path")

    expect(stdout.toString()).toContain("No duplicate class selectors found")
    expect(stdout.toString()).toContain("No potentially leaking class selectors found")
  })

  it("test single glob", async () => {
    const output = executeFailingCommand("node dist/cli.js tests/mock/*.{css,scss,vue}")

    expect(output).toMatchSnapshot()
  })

  it("test multiple globs", async () => {
    const output = executeFailingCommand("node dist/cli.js 'tests/mock/*.css tests/mock/*.scss tests/mock/*.vue'")

    expect(output).toMatchSnapshot()
  })

  it("test glob with single ignore glob", async () => {
    const output = executeFailingCommand("node dist/cli.js tests/mock/*.{css,scss,vue} -i tests/mock/**/*.scss")

    expect(output).toMatchSnapshot()
  })

  it("test glob with multiple ignore glob", async () => {
    const output = executeFailingCommand(
      "node dist/cli.js tests/mock/*.{css,scss,vue} -i 'tests/mock/**/*.scss tests/mock/**/*.css'",
    )

    expect(output).toMatchSnapshot()
  })
})
