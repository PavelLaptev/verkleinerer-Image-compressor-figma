import React from "react";
import styles from "./styles.module.scss";

interface Props {
    className?: string;
    label: string;
    onClick: () => void;
    accent?: boolean;
    style?: React.CSSProperties;
}

// Add parent class for sub-components
const Input: React.FC<Props> = props => {
    return (
        <button
            onClick={props.onClick}
            className={`${styles.button} ${props.accent ? styles.accent : ""} ${props.className || ""}`}
            style={{...props.style}}
        >
            <span>{props.label}</span>
        </button>
    );
};

Input.defaultProps = {
    className: "",
    label: "Button",
};

export default Input;
