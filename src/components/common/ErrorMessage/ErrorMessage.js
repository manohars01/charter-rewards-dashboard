import { memo } from "react";
import PropTypes from "prop-types";
import { ERROR_MESSAGES } from "../../../constants/constants";
import "./ErrorMessage.css";
/**
 * Displays an error message in UI.
 *
 * @param {Object} props
 * @param {string} [props.message='Something went wrong.']
 * @returns {JSX.Element}
 */
const ErrorMessage = ({ message = ERROR_MESSAGES.GENERIC_ERROR }) => {
  return <div className="error-message">{message}</div>;
};

ErrorMessage.propTypes = {
  message: PropTypes.string,
};

export default memo(ErrorMessage);
