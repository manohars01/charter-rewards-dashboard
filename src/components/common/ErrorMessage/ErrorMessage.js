import { memo } from "react";
import PropTypes from "prop-types";
import "./ErrorMessage.css";

const ErrorMessage = ({ message = "Something went wrong." }) => {
  return <div className="error-message">{message}</div>;
};

ErrorMessage.propTypes = {
  message: PropTypes.string,
};

export default memo(ErrorMessage);
