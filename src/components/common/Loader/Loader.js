import { memo } from "react";
import PropTypes from "prop-types";
import { UI_TEXT } from "../../../constants/constants";
import "./Loader.css";
/**
 * Displays a loading indicator with optional message.
 *
 * @param {Object} props
 * @param {string} [props.message='Loading...']
 * @returns {JSX.Element}
 */
const Loader = ({ message = UI_TEXT.LOADING_MESSAGE }) => {
  return <div className="loader">{message}</div>;
};

Loader.propTypes = {
  message: PropTypes.string,
};

export default memo(Loader);
