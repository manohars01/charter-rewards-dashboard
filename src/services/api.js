import { TRANSACTIONS_API_MESSAGES } from "../constants/constants";

/**
 * Fetch transaction list from backend API.
 *
 * @async
 * @function fetchTransactions
 * @returns {Promise<Array<Object>>} transactions list in API response JSON
 * @throws {Error} when network response status is not ok
 */
export const fetchTransactions = async () => {
  const response = await fetch("/mock-data.json");
  if (!response.ok) {
    const errorMessage = TRANSACTIONS_API_MESSAGES.TRANSACTIONS_FETCH_FAILED;
    throw new Error(errorMessage);
  }

  const payload = await response.json();
  const transactions = Array.isArray(payload) ? payload : payload?.transactions;

  if (!Array.isArray(transactions)) {
    const errorMessage = TRANSACTIONS_API_MESSAGES.TRANSACTIONS_FETCH_FAILED;
    throw new Error(errorMessage);
  }

  return transactions;
};
