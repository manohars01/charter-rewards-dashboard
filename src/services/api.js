import { TRANSACTIONS_API_MESSAGES } from "../constants/constants";
import { logger } from "../utils/logger";

/**
 * Fetch transaction list from backend API.
 *
 * @async
 * @function fetchTransactions
 * @returns {Promise<Array<Object>>} transactions list in API response JSON
 * @throws {Error} when network response status is not ok
 */
export const fetchTransactions = async () => {
  logger.info(TRANSACTIONS_API_MESSAGES.TRANSACTIONS_FETCHING_MSG);
  const response = await fetch("/mock-data.json");
  if (!response.ok) {
    const errorMessage = TRANSACTIONS_API_MESSAGES.TRANSACTIONS_FETCH_FAILED;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  const payload = await response.json();
  const transactions = Array.isArray(payload) ? payload : payload?.transactions;

  if (!Array.isArray(transactions)) {
    const errorMessage = TRANSACTIONS_API_MESSAGES.TRANSACTIONS_FETCH_FAILED;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  logger.info(TRANSACTIONS_API_MESSAGES.TRANSACTIONS_FETCHED_SUCCESSFULLY);
  return transactions;
};
