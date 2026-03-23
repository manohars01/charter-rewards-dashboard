function normalizeToLocalIsoDate(dateInput) {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function calculateRewardPointsForTransactions(price) {
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

export function addRewardPointsToTransactions(transactions) {
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  return safeTransactions.map((transaction) => ({
    ...transaction,
    purchaseDate: normalizeToLocalIsoDate(transaction.purchaseDate),
    rewardPoints: calculateRewardPointsForTransactions(transaction.price),
  }));
}
