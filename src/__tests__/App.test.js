import { fireEvent, render, screen } from "@testing-library/react";
import App from "../App";
import useFetch from "../hooks/useFetch";

jest.mock("../hooks/useFetch");

const mockTransactions = [
  {
    transactionId: "TNX-1",
    customerId: "CUST-1",
    customerName: "Alice",
    purchaseDate: "2025-05-01T12:30:00.000Z",
    product: "Tablet",
    price: 120,
  },
];

describe("App", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows a loading message while data is being fetched", () => {
    useFetch.mockReturnValue({ data: [], loading: true, error: null });
    render(<App />);
    expect(screen.getByText("Loading transactions...")).toBeInTheDocument();
  });

  it("shows an error message when the fetch fails", () => {
    useFetch.mockReturnValue({
      data: [],
      loading: false,
      error: "Failed to fetch transactions.",
    });
    render(<App />);
    expect(
      screen.getByText("Failed to fetch transactions."),
    ).toBeInTheDocument();
  });

  it("renders the dashboard title when data loads", () => {
    useFetch.mockReturnValue({
      data: mockTransactions,
      loading: false,
      error: null,
    });
    render(<App />);
    expect(screen.getByText("Customer Rewards Dashboard")).toBeInTheDocument();
  });

  it("shows the Transactions table by default", () => {
    useFetch.mockReturnValue({
      data: mockTransactions,
      loading: false,
      error: null,
    });
    render(<App />);
    expect(screen.getByText("Transaction ID")).toBeInTheDocument();
  });

  it("shows Monthly Rewards columns after selecting that view", () => {
    useFetch.mockReturnValue({
      data: mockTransactions,
      loading: false,
      error: null,
    });
    render(<App />);
    fireEvent.change(screen.getByLabelText("Select View:"), {
      target: { value: "monthlyRewards" },
    });
    expect(screen.getByText("Month")).toBeInTheDocument();
  });

  it("shows Total Rewards columns after selecting that view", () => {
    useFetch.mockReturnValue({
      data: mockTransactions,
      loading: false,
      error: null,
    });
    render(<App />);
    fireEvent.change(screen.getByLabelText("Select View:"), {
      target: { value: "totalRewards" },
    });
    expect(screen.getByText("Total Reward Points")).toBeInTheDocument();
  });
});
