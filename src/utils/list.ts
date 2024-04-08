export const replenishSetList = <T extends Record<string, Set<string>>>(
  list: T,
  key: string,
  item: string | string[],
): T => {
  const set = list[key]
  const items = typeof item === "string" ? [item] : item

  if (!set) {
    // @ts-expect-error -- allow write
    list[key] = new Set(items)
  } else {
    items.forEach(i => set.add(i))
  }

  return list
}
