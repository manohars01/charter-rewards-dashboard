/**
 * Lightweight logging utility that is verbose in non-production environments.
 *
 * In production, info and warn are suppressed.
 * error is always printed.
 */
const isDevelopment = process.env.NODE_ENV !== "production";

export const logger = {
  /**
   * Log informational messages in dev only.
   * @param {...any} args - values to log.
   */
  info: (...args) => {
    if (isDevelopment) {
      console.log("[INFO]", ...args);
    }
  },

  /**
   * Log warning messages in dev only.
   * @param {...any} args - values to warn.
   */
  warn: (...args) => {
    if (isDevelopment) {
      console.warn("[WARN]", ...args);
    }
  },

  /**
   * Log error messages always.
   * @param {...any} args - values to error.
   */
  error: (...args) => {
    console.error("[ERROR]", ...args);
  },
};
