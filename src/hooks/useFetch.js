import { useEffect, useState } from "react";
import { ERROR_MESSAGES } from "../constants/constants";

/**
 * Hook to fetch data from an API.
 *
 * @param {function} fetcher - API call to fetch data.
 * @returns {Object} - object containing data, loading and error state.
 *
 * @example
 * const { data, loading, error } = useFetch(apiCall);
 */
export default function useFetch(fetcher) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetcher();
        if (!ignore) setData(result);
      } catch (err) {
        if (!ignore) setError(err?.message || ERROR_MESSAGES.GENERIC_ERROR);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [fetcher]);

  return { data, loading, error };
}
