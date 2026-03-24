import { fetchTransactions } from "./services/api";
import {
  addRewardPointsToTransactions,
  calculateMonthlyRewardsForCustomers,
  calculateTotalRewardsForCustomers,
} from "./utils/rewardsService";
import Card from "./components/common/Card/Card";
import Loader from "./components/common/Loader/Loader";
import ErrorMessage from "./components/common/ErrorMessage/ErrorMessage";
import "./styles/global.css";
import { TABLE_CONFIG, UI_TEXT } from "./constants/constants";
import useFetch from "./hooks/useFetch";
import { useState, useMemo } from "react";
import Table from "./components/common/Table/Table";

const TABLE_BASE_CONFIG = {
  canSearch: true,
  defaultRowsPerPage: TABLE_CONFIG.DEFAULT_ROWS_PER_PAGE,
  rowsPerPageOptions: TABLE_CONFIG.DEFAULT_ROWS_PER_PAGE_OPTIONS,
};

const TABLE_VIEWS = {
  transactions: {
    tableTitle: UI_TEXT.TABLE_TITLE_TRANSACTIONS,
    columns: [
      { key: "transactionId", header: "Transaction ID" },
      { key: "customerName", header: "Customer Name", sortable: true },
      { key: "purchaseDate", header: "Purchase Date", sortable: true },
      { key: "product", header: "Product Purchased" },
      { key: "price", header: "Price", sortable: true },
      { key: "rewardPoints", header: "Reward Points", sortable: true },
    ],
    rowsMap: addRewardPointsToTransactions,
  },
  monthlyRewards: {
    tableTitle: UI_TEXT.TABLE_TITLE_MONTHLY_REWARDS,
    columns: [
      { key: "customerId", header: "Customer ID" },
      { key: "customerName", header: "Name" },
      { key: "month", header: "Month", sortable: true },
      { key: "year", header: "Year", sortable: true },
      { key: "rewardPoints", header: "Reward Points", sortable: true },
    ],
    rowsMap: calculateMonthlyRewardsForCustomers,
  },
  totalRewards: {
    tableTitle: UI_TEXT.TABLE_TITLE_TOTAL_REWARDS,
    columns: [
      { key: "customerName", header: "Customer Name", sortable: true },
      { key: "rewardPoints", header: "Total Reward Points", sortable: true },
    ],
    rowsMap: calculateTotalRewardsForCustomers,
  },
};

/**
 * App root component.
 *
 * Responsibilities:
 * - Fetch transactions from backend API
 * - Handle loading and error states
 * - Render transaction table and rewards summary tables
 *
 * @returns {JSX.Element}
 */
export default function App() {
  const [view, setView] = useState("transactions");
  const { data: transactions, loading, error } = useFetch(fetchTransactions);

  const { tableTitle, columns, rowsMap } = TABLE_VIEWS[view];

  const handleViewChange = (e) => {
    setView(e.target.value);
  };

  const rows = useMemo(() => {
    return rowsMap(transactions);
  }, [transactions, rowsMap]);

  const tableProps = useMemo(() => {
    return {
      ...TABLE_BASE_CONFIG,
      tableTitle,
      columns,
      rows,
    };
  }, [columns, rows, tableTitle]);

  if (loading) {
    return (
      <Card>
        <Loader message={UI_TEXT.LOADING_TRANSACTIONS} />
      </Card>
    );
  }
  if (error) {
    return (
      <Card>
        <ErrorMessage message={error?.message} />
      </Card>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>{UI_TEXT.DASHBOARD_TITLE}</h1>
        <div className="table-view-selector">
          <label htmlFor="view-dropdown">Select View:</label>
          <select id="view-dropdown" value={view} onChange={handleViewChange}>
            <option value="transactions">Transactions</option>
            <option value="monthlyRewards">Monthly Rewards</option>
            <option value="totalRewards">Total Rewards</option>
          </select>
        </div>
      </header>
      <div className="app-content">
        <Card>
          <Table key={view} {...tableProps} />
        </Card>
      </div>
    </div>
  );
}
