import { useEffect, useState } from "react";
import { APP_CONFIG } from "../constants/constants";

export default function useDebounce(
  value,
  delay = APP_CONFIG.SEARCH_DEBOUNCE_TIME,
) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
