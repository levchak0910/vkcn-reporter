# @vkcn/report

The tool that helps to detect [VKCN](https://www.npmjs.com/package/@vkcn/eslint-plugin) (vue-kebab-class-naming) violations:

- [element](https://github.com/levchak0910/vkcn-eslint-plugin/blob/HEAD/docs/rules/no-convention-violation.md#element-class) class selectors that are defined in different files.
- [modifier](https://github.com/levchak0910/vkcn-eslint-plugin/blob/HEAD/docs/rules/no-convention-violation.md#modifier-class) class selectors that may leak in different files.

It was created specifically for VKCN convention and will not work with any other naming conventions.

Class extraction supported from files: `.css`, `.scss`, `.vue`.

## How to use it

Install the package as a devDependency

```bash
npm install -D @vkcn/reporter
```

```bash
yarn add -D @vkcn/reporter
```

```bash
pnpm add -D @vkcn/reporter
```

This tool can be used:

- programmatically - in a script for a custom reporter
- cli - run as a command from the terminal

### Programmatic usage

Use it in a js/ts script

```ts
import { findViolationsInFiles } from "@vkcn/reporter"

const { duplicates, leaks } = await findViolationsInFiles({
  files: ["styles/**/*.{scss,css}", "components/**/*.vue"],
  ignore: ["some/styles/to/ignore/*.css"],
})

doSomethingWithDuplicates(duplicates)
doSomethingWithLeaks(leaks)
```

Options: `files` and `ignore` should be an array of patterns (provided by [glob](https://www.npmjs.com/package/glob) package)

### CLI usage

Use it via a shell

```bash
vkcn-reporter <files> -i <ignore>
```

Where `<files>` and `<ignore>` - are patterns provided by [glob](https://www.npmjs.com/package/glob) package. Can be used for multiple patterns split by a space `vkcn-reporter 'components/**/*.vue styles/**/*.scss'`. (_Make sure your folder and file names do not contain space_)

If violations are found, the process will finish with a code `1`
