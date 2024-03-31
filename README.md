# @vkcn/report

The tool that helps to detect VKCN violations:

- find class selectors that are defined in different files.

It was created specifically for [vue-kebab-class-naming](https://www.npmjs.com/package/eslint-plugin-vue-kebab-class-naming) convention and will not work with other naming conventions.

Class extraction supported from files: `.css`, `.scss`, `.vue`.

## How to use it

Install the package as a devDependency

```bash
npm install -D vkcn-report-duplicated-class-selectors
```

```bash
yarn add -D vkcn-report-duplicated-class-selectors
```

```bash
pnpm add -D vkcn-report-duplicated-class-selectors
```

This tool can be used:

- programmatically - in a script for the custom reporter
- cli - run as a command from the terminal

### Programmatic usage

Use it in a js/ts script

```ts
import { findDuplicatesInFiles } from "vkcn-report-duplicated-class-selectors"

const duplicates = await findDuplicatesInFiles({
  files: ["styles/**/*.{scss,css}", "components/**/*.vue"],
  ignore: ["some/styles/to/ignore/*.css"],
})

doSomethingWithDuplicates(duplicates)
```

Options: `<files>` and `<ignore>` should be an array of patterns (provided by [glob](https://www.npmjs.com/package/glob) package)

### CLI usage

Use it via a shell

```bash
pnpm @vkcn/reporter <files> -i <ignore>
```

Where `files` and `ignore` - are patterns provided by [glob](https://www.npmjs.com/package/glob) package. Can be used for multiple patterns split by a space `yarn vkcn-report-duplicated-class-selectors components/**/*.vue styles/**/*.scss`

If violations are found, the process will finish with a code `1`
