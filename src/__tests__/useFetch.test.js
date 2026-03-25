import { renderHook, waitFor } from "@testing-library/react";
import useFetch from "../hooks/useFetch";

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});
afterAll(() => {
  console.error.mockRestore();
});

describe("useFetch", () => {
  it("returns fetched data on success", async () => {
    const fetcher = jest.fn().mockResolvedValue([{ id: 1 }]);

    const { result } = renderHook(() => useFetch(fetcher));

    expect(result.current.data).toEqual([]);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual([{ id: 1 }]);
    expect(result.current.error).toBeNull();
  });

  it("returns error message on failure", async () => {
    const fetcher = jest.fn().mockRejectedValue(new Error("Request failed"));

    const { result } = renderHook(() => useFetch(fetcher));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toEqual({ message: "Request failed" });
    expect(result.current.data).toEqual([]);
  });

  it("falls back to the generic error message when none is available", async () => {
    const fetcher = jest.fn().mockRejectedValue({});

    const { result } = renderHook(() => useFetch(fetcher));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toEqual({ message: "Something went wrong." });
  });
});
