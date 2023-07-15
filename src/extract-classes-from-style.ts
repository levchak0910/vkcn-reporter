import postcss from "postcss"
import postcssSCSS from "postcss-scss"
import postcssExtract, { type pluginOptions } from "@csstools/postcss-extract"

export const extractClassSelectorsFromStyleSource = async (source: string): Promise<string[]> => {
  const classes = new Set<string>()

  await postcss([
    postcssExtract({
      extractLate: true,
      queries: { classes: 'rule[selector^="."]' },
      results(results) {
        return (results.classes ?? []).flatMap(entry => {
          const { selectors: classSelectors } = entry as { selectors: string[] }

          classSelectors
            .flatMap(classSelector => classSelector.split(" "))
            .flatMap(classSelector => classSelector.split("."))
            .filter(classSelector => classSelector.includes("--"))
            .forEach(filteredClassSelector => classes.add(filteredClassSelector))
        })
      },
    } satisfies pluginOptions),
  ]).process(source, { syntax: postcssSCSS, from: undefined })

  return Array.from(classes)
}
