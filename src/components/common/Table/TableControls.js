import PropTypes from "prop-types";
import "./Table.css";

/**
 * Table controls component for search and rows-per-page selection.
 *
 * @param {Object} props
 * @param {boolean} props.canSearch
 * @param {string} props.searchValue
 * @param {function} props.onSearchChange
 * @param {number} props.rowsPerPage
 * @param {Array<number>} props.rowsPerPageOptions
 * @param {function} props.onRowsPerPageChange
 * @returns {JSX.Element}
 */
export default function TableControls({
  canSearch,
  searchValue,
  onSearchChange,
  rowsPerPage,
  rowsPerPageOptions,
  onRowsPerPageChange,
}) {
  return (
    <div className="table-controls">
      {canSearch && (
        <input
          type="text"
          value={searchValue}
          onChange={onSearchChange}
          placeholder="Search..."
          className="table-search"
        />
      )}

      <div className="table-page-size">
        <label htmlFor="page-size-select">Rows per page:</label>
        <select
          id="page-size-select"
          value={rowsPerPage}
          onChange={onRowsPerPageChange}
        >
          {rowsPerPageOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

TableControls.propTypes = {
  canSearch: PropTypes.bool,
  searchValue: PropTypes.string,
  onSearchChange: PropTypes.func.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  onRowsPerPageChange: PropTypes.func.isRequired,
};
