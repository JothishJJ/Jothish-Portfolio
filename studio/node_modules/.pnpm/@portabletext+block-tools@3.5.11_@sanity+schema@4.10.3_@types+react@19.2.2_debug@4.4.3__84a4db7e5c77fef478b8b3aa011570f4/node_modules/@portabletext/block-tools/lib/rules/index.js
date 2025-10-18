import { isTextBlock } from "@portabletext/schema";
import { isElement, tagName, flattenNestedBlocks } from "../_chunks-es/helpers.js";
function createFlattenTableRule({
  schema,
  separator
}) {
  return {
    deserialize: (node, next) => {
      if (!isElement(node) || tagName(node) !== "table")
        return;
      const columnCounts = [...node.querySelectorAll("tr")].map((row) => row.querySelectorAll("td, th").length), firstColumnCount = columnCounts[0];
      if (!firstColumnCount || !columnCounts.every((count) => count === firstColumnCount))
        return;
      const headerRows = node.querySelector("thead")?.querySelectorAll("tr"), tbody = node.querySelector("tbody"), bodyRows = tbody ? [...tbody.querySelectorAll("tr")] : [];
      if (!headerRows || !bodyRows)
        return;
      const headerRow = [...headerRows][0];
      if (!headerRow || headerRows.length > 1)
        return;
      const headerResults = [...headerRow.querySelectorAll("th, td")].map(
        (headerCell) => next(headerCell)
      ), rows = [];
      for (const row of bodyRows) {
        const cells = row.querySelectorAll("td");
        let cellIndex = 0;
        for (const cell of cells) {
          const result = next(cell);
          if (!result) {
            cellIndex++;
            continue;
          }
          const headerResult = headerResults[cellIndex];
          if (!headerResult) {
            Array.isArray(result) ? rows.push(...result) : rows.push(result), cellIndex++;
            continue;
          }
          const flattenedHeaderResult = flattenNestedBlocks(
            { schema },
            Array.isArray(headerResult) ? headerResult : [headerResult]
          ), firstFlattenedHeaderResult = flattenedHeaderResult[0], flattenedResult = flattenNestedBlocks(
            { schema },
            Array.isArray(result) ? result : [result]
          ), firstFlattenedResult = flattenedResult[0];
          if (flattenedHeaderResult.length === 1 && isTextBlock({ schema }, firstFlattenedHeaderResult) && flattenedResult.length === 1 && isTextBlock({ schema }, firstFlattenedResult)) {
            const separatorChild = separator?.(), mergedTextBlock = {
              ...firstFlattenedHeaderResult,
              children: [
                ...firstFlattenedHeaderResult.children,
                ...separatorChild ? [separatorChild] : [],
                ...firstFlattenedResult.children
              ],
              markDefs: [
                ...firstFlattenedHeaderResult.markDefs ?? [],
                ...firstFlattenedResult.markDefs ?? []
              ]
            };
            rows.push(mergedTextBlock), cellIndex++;
            continue;
          }
          Array.isArray(headerResult) ? rows.push(...headerResult) : rows.push(headerResult), Array.isArray(result) ? rows.push(...result) : rows.push(result), cellIndex++;
        }
      }
      return rows;
    }
  };
}
export {
  createFlattenTableRule
};
//# sourceMappingURL=index.js.map
