/**
 * Converts a date input to a local ISO 8601 date string (YYYY-MM-DD format).
 *
 * @param {Date|string|number} dateInput - The date to normalize. Can be a Date object, ISO string, or timestamp.
 * @returns {string} A local ISO date string in YYYY-MM-DD format, or an empty string if the input is invalid.
 *
 * @example
 * // Returns "2024-01-15"
 * normalizeToLocalIsoDate(new Date(2024, 0, 15));
 *
 * @example
 * // Returns ""
 * normalizeToLocalIsoDate("invalid-date");
 */
function normalizeToLocalIsoDate(dateInput) {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Attach calculated reward points and normalized date to each transaction.
 *
 * @param {Array<Object>} transactions - Array of transaction objects.
 * @param {string} transactions[].purchaseDate - ISO start date string (e.g., '2025-05-01T12:34:56.000Z').
 * @param {number} transactions[].price - Price used for reward computation.
 * @returns {Array<Object>} transactions with added `rewardPoints` and normalized `purchaseDate` ('YYYY-MM-DD').
 */
export function addRewardPointsToTransactions(transactions) {
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  return safeTransactions.map((transaction) => ({
    ...transaction,
    purchaseDate: normalizeToLocalIsoDate(transaction.purchaseDate),
    rewardPoints: calculateRewardPointsForTransactions(transaction.price),
  }));
}

/**
 * Group transactions by customer and calendar month/year to compute monthly reward totals.
 *
 * @param {Array<Object>} transactions - Raw transaction list.
 * @param {string} transactions[].customerId - unique customer id.
 * @param {string} transactions[].customerName - customer name.
 * @param {string} transactions[].purchaseDate - ISO transaction date string (e.g., '2024-06-15T12:00:00.000Z').
 * @param {number} transactions[].price - transaction price used to compute reward points.
 * @returns {Array<Object>} aggregated monthly reward records with: customerId, customerName, month, year, rewardPoints.
 */
export function calculateMonthlyRewardsForCustomers(transactions) {
  if (!Array.isArray(transactions)) return [];
  const transactionsWithRewards = addRewardPointsToTransactions(transactions);
  const rewardsMap = transactionsWithRewards.reduce((acc, transaction) => {
    const date = new Date(transaction.purchaseDate);
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    const key = `${transaction.customerId}-${month}-${year}`;

    if (!acc[key]) {
      acc[key] = {
        customerId: transaction.customerId,
        customerName: transaction.customerName,
        month,
        year,
        rewardPoints: 0,
      };
    }

    acc[key].rewardPoints += transaction.rewardPoints;

    return acc;
  }, {});

  return Object.values(rewardsMap);
}

/**
 * Calculate reward points for a transaction amount.
 *
 * Rules:
 * - 1 point for each dollar spent over $50 up to $100
 * - 2 points for each dollar spent over $100
 *
 * @param {number} price - Transaction amount.
 * @returns {number} reward points for the transaction.
 * @throws {Error} if price is null, undefined, or NaN.
 */
export function calculateRewardPointsForTransactions(price) {
  if (price === null || price === undefined || Number.isNaN(price)) {
    throw new Error(
      "Invalid transaction price: value is required and must be a valid number.",
    );
  }

  const amount = Math.floor(price);
  if (Number.isNaN(amount)) {
    throw new Error(
      "Invalid transaction price: value must resolve to a valid number.",
    );
  }
  let points = 0;
  if (amount > 100) {
    points += 50;
    points += (amount - 100) * 2;
  } else if (amount > 50) {
    points += amount - 50;
  }
  return points;
}

/**
 * Calculate aggregated total reward points per customer.
 *
 * @param {Array<Object>} transactions - Raw transaction list.
 * @param {string} transactions[].customerId
 * @param {string} transactions[].customerName
 * @param {number} transactions[].price - transaction price used to compute reward points.
 * @returns {Array<Object>} list of customers with aggregated `rewardPoints`.
 */
export function calculateTotalRewardsForCustomers(transactions) {
  if (!Array.isArray(transactions)) return [];
  const transactionsWithRewards = addRewardPointsToTransactions(transactions);
  const totalRewardsForCustomer = transactionsWithRewards.reduce(
    (acc, transaction) => {
      const key = transaction.customerId;
      if (!acc[key]) {
        acc[key] = {
          customerName: transaction.customerName,
          rewardPoints: 0,
        };
      }
      acc[key].rewardPoints = acc[key].rewardPoints + transaction.rewardPoints;

      return acc;
    },
    {},
  );

  return Object.values(totalRewardsForCustomer);
}
