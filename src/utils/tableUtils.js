import { TABLE_CONFIG } from "../constants/constants";

/**
 * Sort rows by given column and order.
 *
 * @param {Object|null} sortConfig - sorting state. e.g. { key, order }
 * @param {Array<Object>} rows - table rows to sort.
 * @returns {Array<Object>} sorted rows (new array, original is untouched).
 */
export function sortRows(sortConfig, rows) {
  if (!sortConfig) return rows;
  const { key, order } = sortConfig;
  const sortedRows = [...rows];
  return sortedRows.sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];
    if (aValue === bValue) return 0;
    // sorting for string and numbers
    if (order === TABLE_CONFIG.SORT_ORDER_ASCENDING) {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });
}

/**
 * Filter rows by search query over visible columns.
 *
 * @param {boolean} canSearch - enable/disable search filtering.
 * @param {string} searchValue - search input value.
 * @param {Array<Object>} rows - table data rows.
 * @param {Array<Object>} columns - column definitions, with `key` props.
 * @returns {Array<Object>} filtered rows.
 */
export function filterRows(canSearch, searchValue, rows, columns) {
  if (!canSearch) return rows;
  const query = searchValue.trim().toLowerCase();
  return rows.filter((row) => {
    // Keep rows where query text matches at least one field
    // Array some to only check if query existing in any column ignore other cols if found earlier
    return columns.some((col) => {
      const cellValue = row[col.key];
      if (cellValue === null || cellValue === undefined) return false;
      return String(cellValue).toLowerCase().includes(query);
    });
  });
}

/**
 * Paginate rows using page and page size.
 *
 * @param {number} currentPage
 * @param {number} rowsPerPage
 * @param {Array<Object>} rows
 * @returns {Array<Object>} rows for current page
 */
export function paginateRows(currentPage, rowsPerPage, rows) {
  const start = currentPage === 1 ? 0 : (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  return rows.slice(start, end);
}
