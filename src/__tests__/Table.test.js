import { act, fireEvent, render, screen } from "@testing-library/react";
import Table from "../components/common/Table/Table";
import { APP_CONFIG } from "../constants/constants";

const columns = [
  { key: "name", header: "Name", sortable: true },
  { key: "amount", header: "Amount", sortable: true },
];

const rows = [
  { id: 1, name: "Alice", amount: 50 },
  { id: 2, name: "Bob", amount: 120 },
  { id: 3, name: "Charlie", amount: 80 },
];

describe("Table", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it("renders the column headers", () => {
    render(<Table columns={columns} rows={rows} tableTitle="Transactions" />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
  });

  it("renders the table title", () => {
    render(<Table columns={columns} rows={rows} tableTitle="Transactions" />);
    expect(screen.getByText("Transactions")).toBeInTheDocument();
  });

  it("shows a no data message when rows is empty", () => {
    render(<Table columns={columns} rows={[]} tableTitle="Transactions" />);
    expect(screen.getByText("No data to show")).toBeInTheDocument();
  });

  it("renders a row for each data item", () => {
    render(<Table columns={columns} rows={rows} tableTitle="Transactions" />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
  });

  it("filters visible rows when the user types in the search box", () => {
    render(<Table columns={columns} rows={rows} tableTitle="Transactions" />);

    fireEvent.change(screen.getByPlaceholderText("Search..."), {
      target: { value: "bob" },
    });

    // The search is debounced, so we advance the timer to trigger the filter
    act(() => {
      jest.advanceTimersByTime(APP_CONFIG.SEARCH_DEBOUNCE_TIME);
    });

    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
  });

  it("shows the correct page information", () => {
    render(
      <Table
        columns={columns}
        rows={rows}
        tableTitle="Transactions"
        defaultRowsPerPage={1}
        rowsPerPageOptions={[1, 3]}
      />,
    );
    expect(screen.getByText("Page 1 of 3 (3 items)")).toBeInTheDocument();
  });

  it("navigates to the next page when the next button is clicked", () => {
    render(
      <Table
        columns={columns}
        rows={rows}
        tableTitle="Transactions"
        defaultRowsPerPage={1}
        rowsPerPageOptions={[1, 3]}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "›" }));
    expect(screen.getByText("Page 2 of 3 (3 items)")).toBeInTheDocument();
  });
});
