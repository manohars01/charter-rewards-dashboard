import React from "react";
import PropTypes from "prop-types";
import { ERROR_MESSAGES } from "../../../constants/constants";
import { logger } from "../../../utils/logger";
/**
 * React ErrorBoundary component to catch render errors in child subtree.
 *
 * Wrap components that may throw errors to prevent entire app crash.
 * Renders a fallback message when an error is detected.
 *
 * @extends React.Component
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>{ERROR_MESSAGES.COMPONENT_RENDER_ERROR}</div>;
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
