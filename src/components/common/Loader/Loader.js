import { memo } from "react";
import PropTypes from "prop-types";
import "./Loader.css";

const Loader = ({ message = "Loading..." }) => {
  return <div className="loader">{message}</div>;
};

Loader.propTypes = {
  message: PropTypes.string,
};

export default memo(Loader);
