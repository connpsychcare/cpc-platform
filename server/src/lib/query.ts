export const getMissingIncludeIds = <T extends { id: string }>(
  items: T[],
  includeIds: string[],
) => {
  const existingIds = new Set(items.map((item) => item.id));
  return includeIds.filter((id) => !existingIds.has(id));
};

export const mergeIncludedRows = <T extends { id: string }>(
  items: T[],
  forcedItems: T[],
) => {
  return [...forcedItems, ...items].filter(
    (item, index, arr) => index === arr.findIndex((candidate) => candidate.id === item.id),
  );
};
