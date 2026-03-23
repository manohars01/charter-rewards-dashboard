import PropTypes from "prop-types";
import { useMemo, useState, useEffect } from "react";
import TablePagination from "./TablePagination";
import TableControls from "./TableControls";
import { filterRows, sortRows, paginateRows } from "../../../utils/tableUtils";
import "./Table.css";

function Table({
  columns = [],
  rows = [],
  canSearch = true,
  defaultRowsPerPage = 10,
  rowsPerPageOptions = [5, 10, 20, 50],
  tableTitle = "",
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [sortConfig, setSortConfig] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState(searchValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const searchChangeHandler = (e) => {
    setSearchValue(e.target.value);
    setCurrentPage(1);
  };

  const setRowsPerPageHandler = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const toggleSorting = (column) => {
    if (!column.sortable) return;
    setCurrentPage(1);
    setSortConfig((prev) => {
      if (!prev || prev.key !== column.key) {
        return { key: column.key, order: "asc" };
      }
      if (prev.order === "asc") {
        return { key: column.key, order: "desc" };
      }
      return null;
    });
  };

  const filteredRows = useMemo(
    () => filterRows(canSearch, debouncedSearch, rows, columns),
    [canSearch, debouncedSearch, rows, columns],
  );

  const sortedRows = useMemo(
    () => sortRows(sortConfig, filteredRows),
    [sortConfig, filteredRows],
  );

  const totalItems = sortedRows.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage) || 1;

  const paginatedRows = useMemo(
    () => paginateRows(currentPage, rowsPerPage, sortedRows),
    [currentPage, rowsPerPage, sortedRows],
  );

  return (
    <div className="table-container">
      {tableTitle && <div className="table-title">{tableTitle}</div>}
      <TableControls
        canSearch={canSearch}
        onRowsPerPageChange={setRowsPerPageHandler}
        onSearchChange={searchChangeHandler}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        searchValue={searchValue}
      />
      <div className="table-content">
        <table className="table">
          <thead>
            <tr>
              {columns.map((col) => {
                const isSorted = sortConfig && sortConfig.key === col.key;
                const order = isSorted ? sortConfig.order : null;
                const sortable = Boolean(col.sortable);

                return (
                  <th
                    key={col.key}
                    className={sortable ? "sortable" : ""}
                    onClick={() => sortable && toggleSorting(col)}
                  >
                    <span>{col.header}</span>
                    {sortable && (
                      <span className="sort-indicator">
                        {isSorted
                          ? order === "asc"
                            ? " ▲"
                            : " ▼"
                          : " ⇅"}
                      </span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="no-data">
                  No data to show
                </td>
              </tr>
            )}

            {paginatedRows.length > 0 &&
              paginatedRows.map((row, rowIndex) => {
                return (
                  <tr key={row.id || rowIndex}>
                    {columns.map((col) => (
                      <td key={rowIndex + col.key}>{row[col.key]}</td>
                    ))}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <TablePagination
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        totalPages={totalPages}
        totalItems={totalItems}
      />
    </div>
  );
}

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      header: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
    }),
  ),
  rows: PropTypes.arrayOf(PropTypes.object),
  canSearch: PropTypes.bool,
  defaultRowsPerPage: PropTypes.number,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  tableTitle: PropTypes.string,
};

export default Table;
