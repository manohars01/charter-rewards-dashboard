import {
  addRewardPointsToTransactions,
  calculateMonthlyRewardsForCustomers,
  calculateRewardPointsForTransactions,
  calculateTotalRewardsForCustomers,
} from "../utils/rewardsService";

describe("rewardsServices", () => {
  describe("addRewardPointsToTransactions", () => {
    it("returns empty array for non-array input", () => {
      expect(addRewardPointsToTransactions(null)).toEqual([]);
      expect(addRewardPointsToTransactions(undefined)).toEqual([]);
      expect(addRewardPointsToTransactions({})).toEqual([]);
    });

    it("handles missing purchaseDate gracefully", () => {
      const input = [
        {
          transactionId: "T1",
          customerId: "C1",
          customerName: "Test",
          purchaseDate: null,
          price: 120,
        },
      ];
      const result = addRewardPointsToTransactions(input);
      expect(result[0].rewardPoints).toBe(90);
    });

    it("throws for invalid price", () => {
      expect(() => calculateRewardPointsForTransactions(null)).toThrow(
        "Invalid transaction price",
      );
      expect(() => calculateRewardPointsForTransactions(undefined)).toThrow(
        "Invalid transaction price",
      );
      expect(() => calculateRewardPointsForTransactions("abc")).toThrow(
        "Invalid transaction price",
      );
    });
    it("returns empty array when no transactions", () => {
      const result = addRewardPointsToTransactions([]);
      expect(result).toEqual([]);
    });

    it("should add rewardPoints and normalize purchaseDate for each transaction", () => {
      const input = [
        {
          transactionId: "TNX-100001",
          customerId: "CUST-1001",
          customerName: "Gary Moore",
          purchaseDate: "2025-05-01T12:30:00.000Z",
          product: "Headphones",
          price: 199.99,
        },
        {
          transactionId: "TNX-100002",
          customerId: "CUST-1002",
          customerName: "Amy Johnson",
          purchaseDate: "2024-11-23T08:15:05.512Z",
          product: "Phone",
          price: 30,
        },
        {
          transactionId: "TNX-100003",
          customerId: "CUST-1003",
          customerName: "Emily Davis",
          purchaseDate: "2026-03-20T09:00:00.000Z",
          product: "Tablet",
          price: 75.5,
        },
      ];

      const result = addRewardPointsToTransactions(input);

      expect(result).toHaveLength(3);

      expect(result[0]).toMatchObject({
        transactionId: "TNX-100001",
        customerId: "CUST-1001",
        customerName: "Gary Moore",
        purchaseDate: "2025-05-01",
        product: "Headphones",
        price: 199.99,
        rewardPoints: 248, // 50 + (Math.floor(199.99) - 100) * 2 = 50 + 99*2 = 248
      });

      expect(result[1]).toMatchObject({
        purchaseDate: "2024-11-23",
        rewardPoints: 0,
      });

      expect(result[2]).toMatchObject({
        purchaseDate: "2026-03-20",
        rewardPoints: 25,
      });
    });

    it("should not mutate the original transactions array", () => {
      const input = [
        {
          transactionId: "TNX-100010",
          customerId: "CUST-1020",
          customerName: "Noah Walker",
          purchaseDate: "2024-12-31T23:59:59.999Z",
          product: "Watch",
          price: 120,
        },
      ];

      const inputCopy = JSON.parse(JSON.stringify(input));
      const output = addRewardPointsToTransactions(input);

      expect(input).toEqual(inputCopy);
      expect(output[0]).not.toBe(input[0]);
    });
  });

  describe("calculateMonthlyRewardsForCustomers", () => {
    it("returns empty array for non-array input", () => {
      expect(calculateMonthlyRewardsForCustomers(null)).toEqual([]);
      expect(calculateMonthlyRewardsForCustomers(undefined)).toEqual([]);
    });

    it("returns empty array when no transactions", () => {
      const result = calculateMonthlyRewardsForCustomers([]);
      expect(result).toEqual([]);
    });

    it("should add monthly rewards for customers", () => {
      const input = [
        {
          transactionId: "TNX-100001",
          customerId: "CUST-1001",
          customerName: "Gary Moore",
          purchaseDate: "2025-05-01T12:30:00.000Z",
          product: "Headphones",
          price: 199.99,
        },
        {
          transactionId: "TNX-100002",
          customerId: "CUST-1002",
          customerName: "Amy Johnson",
          purchaseDate: "2024-11-23T08:15:05.512Z",
          product: "Phone",
          price: 30,
        },
        {
          transactionId: "TNX-100003",
          customerId: "CUST-1003",
          customerName: "Emily Davis",
          purchaseDate: "2026-03-20T09:00:00.000Z",
          product: "Tablet",
          price: 75.5,
        },
        {
          transactionId: "TNX-100004",
          customerId: "CUST-1001",
          customerName: "Gary Moore",
          purchaseDate: "2025-05-02T12:30:00.000Z",
          product: "Tablet",
          price: 100.9,
        },
        {
          transactionId: "TNX-100005",
          customerId: "CUST-1001",
          customerName: "Gary Moore",
          purchaseDate: "2024-06-02T12:30:00.000Z",
          product: "Tablet",
          price: 100.9,
        },
      ];

      const withRewardPoints = addRewardPointsToTransactions(input);
      const result = calculateMonthlyRewardsForCustomers(withRewardPoints);

      expect(result).toHaveLength(4);

      const mayReward = result.find(
        (item) =>
          item.customerId === "CUST-1001" &&
          item.month === "May" &&
          item.year === 2025,
      );
      const juneReward = result.find(
        (item) =>
          item.customerId === "CUST-1001" &&
          item.month === "June" &&
          item.year === 2024,
      );
      const amyReward = result.find(
        (item) => item.customerId === "CUST-1002" && item.month === "November",
      );
      const emilyReward = result.find(
        (item) => item.customerId === "CUST-1003" && item.month === "March",
      );

      expect(mayReward).toMatchObject({
        customerName: "Gary Moore",
        rewardPoints: 298,
      });
      expect(juneReward).toMatchObject({
        customerName: "Gary Moore",
        rewardPoints: 50,
      });
      expect(amyReward).toMatchObject({
        customerName: "Amy Johnson",
        rewardPoints: 0,
      });
      expect(emilyReward).toMatchObject({
        customerName: "Emily Davis",
        rewardPoints: 25,
      });
    });

    it("handles same customer across multiple months", () => {
      const input = [
        {
          transactionId: "TNX-100006",
          customerId: "CUST-1004",
          customerName: "Test User",
          purchaseDate: "2025-01-10T10:00:00.000Z",
          product: "Item1",
          price: 150.5,
        },
        {
          transactionId: "TNX-100007",
          customerId: "CUST-1004",
          customerName: "Test User",
          purchaseDate: "2025-02-15T10:00:00.000Z",
          product: "Item2",
          price: 120,
        },
        {
          transactionId: "TNX-100008",
          customerId: "CUST-1004",
          customerName: "Test User",
          purchaseDate: "2025-02-20T10:00:00.000Z",
          product: "Item3",
          price: 80.99,
        },
      ];
      const withRewardPoints = addRewardPointsToTransactions(input);
      const result = calculateMonthlyRewardsForCustomers(withRewardPoints);

      const jan = result.find((item) => item.month === "January");
      const feb = result.find((item) => item.month === "February");

      expect(jan.rewardPoints).toBe(150);
      expect(feb.rewardPoints).toBe(120);
    });
  });

  describe("calculateRewardPointsForTransactions", () => {
    it("handles numeric string values", () => {
      expect(calculateRewardPointsForTransactions("120")).toBe(90);
    });

    it("returns 0 for amounts <= 50", () => {
      expect(calculateRewardPointsForTransactions(0)).toBe(0);
      expect(calculateRewardPointsForTransactions(50)).toBe(0);
      expect(calculateRewardPointsForTransactions(49.99)).toBe(0);
    });

    it("adds 1 point per dollar for 51-100 range", () => {
      expect(calculateRewardPointsForTransactions(51)).toBe(1);
      expect(calculateRewardPointsForTransactions(75.99)).toBe(25); // floor 75
      expect(calculateRewardPointsForTransactions(100)).toBe(50);
    });

    it("adds 2 points per dollar over 100 plus 50 base points", () => {
      expect(calculateRewardPointsForTransactions(101)).toBe(52);
      expect(calculateRewardPointsForTransactions(120)).toBe(90); // 50 + 40
    });

    it("floors decimal prices before calculation", () => {
      expect(calculateRewardPointsForTransactions(99.99)).toBe(49);
      expect(calculateRewardPointsForTransactions(100.99)).toBe(50);
      expect(calculateRewardPointsForTransactions(199.99)).toBe(248); // floor 199 => 50 + 198
    });
  });

  describe("calculateTotalRewardsForCustomers", () => {
    it("returns empty array for non-array input", () => {
      expect(calculateTotalRewardsForCustomers(null)).toEqual([]);
      expect(calculateTotalRewardsForCustomers(undefined)).toEqual([]);
    });

    it("returns empty array with no transactions", () => {
      expect(calculateTotalRewardsForCustomers([])).toEqual([]);
    });

    it("aggregates rewardPoints by customerId", () => {
      const transactions = [
        { customerId: "CUST-1", customerName: "Alice", price: 60 },
        { customerId: "CUST-2", customerName: "Bob", price: 70 },
        { customerId: "CUST-1", customerName: "Alice", price: 65 },
      ];

      const result = calculateTotalRewardsForCustomers(transactions);

      expect(result).toHaveLength(2);

      expect(result).toEqual(
        expect.arrayContaining([
          { customerName: "Alice", rewardPoints: 25 },
          { customerName: "Bob", rewardPoints: 20 },
        ]),
      );
    });
  });
});
