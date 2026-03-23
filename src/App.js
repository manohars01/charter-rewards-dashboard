import { fetchTransactions } from "./services/api";
import { addRewardPointsToTransactions } from "./utils/rewardsService";
import Card from "./components/common/Card/Card";
import Loader from "./components/common/Loader/Loader";
import ErrorMessage from "./components/common/ErrorMessage/ErrorMessage";
import "./styles/global.css";
import { useState, useEffect, useMemo } from "react";
import Table from "./components/common/Table/Table";

const TRANSACTIONS_COLUMNS = [
  { key: "transactionId", header: "Transaction ID" },
  { key: "customerName", header: "Customer Name", sortable: true },
  { key: "purchaseDate", header: "Purchase Date", sortable: true },
  { key: "product", header: "Product Purchased" },
  { key: "price", header: "Price", sortable: true },
  { key: "rewardPoints", header: "Reward Points", sortable: true },
];

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchTransactions();
        if (!ignore) setTransactions(Array.isArray(result) ? result : []);
      } catch (err) {
        const message = err?.message || "Something went wrong.";
        if (!ignore) setError({ message });
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchData();
    return () => {
      ignore = true;
    };
  }, []);

  const rows = useMemo(
    () => addRewardPointsToTransactions(transactions),
    [transactions],
  );

  if (loading) {
    return (
      <Card>
        <Loader message="Loading transactions..." />
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
        <h1>Customer Rewards Dashboard</h1>
      </header>
      <div className="app-content">
        <Card>
          <Table
            tableTitle="Transactions"
            columns={TRANSACTIONS_COLUMNS}
            rows={rows}
            canSearch
            defaultRowsPerPage={10}
            rowsPerPageOptions={[5, 10, 20, 50]}
          />
        </Card>
      </div>
    </div>
  );
}
