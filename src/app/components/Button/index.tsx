import React from "react";
import styles from "./styles.module.scss";

interface Props {
    className?: string;
    label: string;
    onClick: () => void;
    accent?: boolean;
    outline?: boolean;
    disabled?: boolean;
    style?: React.CSSProperties;
}

// Add parent class for sub-components
const Input: React.FC<Props> = props => {
    const passButtonMode = () => {
        if (props.accent) {
            return styles.accent;
        }
        if (props.outline) {
            return styles.outline;
        }
        return "";
    };

    return (
        <button
            onClick={props.onClick}
            className={`${styles.button} ${passButtonMode()} ${props.className || ""}`}
            disabled={props.disabled}
            style={{...props.style}}
        >
            <span>{props.label}</span>
        </button>
    );
};

Input.defaultProps = {
    className: "",
    label: "Button",
    disabled: false,
};

export default Input;
