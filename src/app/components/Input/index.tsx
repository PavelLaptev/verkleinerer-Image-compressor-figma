import React from "react";
import styles from "./styles.module.scss";

interface DropdownProps {
    options?: string[];
    onChange?: (value: string) => void;
    value?: string;
}

interface InputTextProps {
    value?: string;
    mode?: "text" | "number";
    onChange?: (value: string) => void;
}

interface InputBaseProps extends InputTextProps, DropdownProps {
    type: "input" | "dropdown";
    label: string;
}

const Dropdown: React.FC<DropdownProps> = props => {
    return (
        <select className={styles.input} value={props.value} onChange={e => props.onChange(e.target.value)}>
            {props.options.map((option, index) => {
                return (
                    <option key={index} value={option}>
                        {option}
                    </option>
                );
            })}
        </select>
    );
};

const InputText: React.FC<InputTextProps> = props => {
    return <input className={styles.input} value={props.value} onChange={e => props.onChange(e.target.value)} />;
};

// Add parent class for sub-components
const Input: React.FC<InputBaseProps> = props => {
    const addInputComponent = () => {
        switch (props.type) {
            case "input":
                return <InputText {...props} />;
            case "dropdown":
                return <Dropdown {...props} />;
            default:
                return null;
        }
    };

    return (
        <div className={styles.wrap}>
            <label className={styles.label}>{props.label}</label>
            {addInputComponent()}
        </div>
    );
};

export default Input;
