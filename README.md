# vkcn-report-duplicated-class-selectors

This tool help to find class selectors which where defined in different files.

It was created only to find duplicates for vue-kebab-class-naming convention and will not work with other naming conventions.

Class extraction supported from files: `.css`, `.scss`, `.vue`.

## How to use it

Install the package as a devDependency

```bash
yarn add -D vkcn-report-duplicated-class-selectors
# or
npm install -D vkcn-report-duplicated-class-selectors
```

This tool can be used:

- programmatically - in a script for custom reporter
- cli - run as command from terminal

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

Options: `<files>` and `<ignore>` should be array of patterns (provided by [glob](https://www.npmjs.com/package/glob) package)

### CLI usage

Use it via shell

```bash
yarn vkcn-report-duplicated-class-selectors <files> -i <ignore>
```

Where `files` and `ignore` - is a pattern provided by [glob](https://www.npmjs.com/package/glob) package. Can be used for multiple patterns split by comma `components/**/*.vue,styles/**/*.scss`

If duplicates was found then the process will finish with code `1`
