import PropTypes from "prop-types";
import "./Table.css";

/**
 * Pagination controls for Table component.
 *
 * @param {Object} props
 * @param {function} props.handlePageChange - callback for page changes (new page number).
 * @param {number} props.currentPage - currently selected page.
 * @param {number} props.totalPages - total number of pages.
 * @param {number} props.totalItems - total number of items across all pages.
 * @returns {JSX.Element}
 */
export default function TablePagination({
  handlePageChange,
  currentPage,
  totalPages,
  totalItems,
}) {
  return (
    <div className="table-pagination">
      <button
        type="button"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
      >
        «
      </button>
      <button
        type="button"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ‹
      </button>

      <span>
        Page {currentPage} of {totalPages} ({totalItems} items)
      </span>

      <button
        type="button"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        ›
      </button>
      <button
        type="button"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        »
      </button>
    </div>
  );
}

TablePagination.propTypes = {
  handlePageChange: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
};
