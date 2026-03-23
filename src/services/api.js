export const fetchTransactions = async () => {
  const response = await fetch("/mock-data.json");
  if (!response.ok) {
    throw new Error("Failed to fetch transactions.");
  }

  const payload = await response.json();
  const transactions = Array.isArray(payload) ? payload : payload?.transactions;

  if (!Array.isArray(transactions)) {
    throw new Error("Failed to fetch transactions.");
  }

  return transactions;
};
