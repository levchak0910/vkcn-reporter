import postcss from "postcss"
import postcssSCSS from "postcss-scss"
import postcssExtract, { type pluginOptions } from "@csstools/postcss-extract"

export const extractClassSelectorsFromStyleSource = async (source: string): Promise<string[]> => {
  const classes = new Set<string>()

  await postcss([
    postcssExtract({
      extractLate: true,
      queries: {
        elementClasses: 'rule[selector^="."]',
        modifierClasses: 'rule[selector^="&."]',
      },
      results(results) {
        const extractedClasses = [results.elementClasses ?? [], results.modifierClasses ?? []].flat()

        extractedClasses.flatMap(entry => {
          const { selectors: classSelectors } = entry as { selectors: string[] }

          classSelectors
            .flatMap(classSelector => classSelector.split(" "))
            .forEach(classSelector => classes.add(classSelector))
        })
      },
    } satisfies pluginOptions),
  ]).process(source, { syntax: postcssSCSS, from: undefined })

  return Array.from(classes)
}
