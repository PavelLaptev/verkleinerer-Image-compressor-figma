import React from "react";
import styles from "./styles.module.scss";

interface Props {
    className?: string;
    label?: string;
    onChange?: (value: boolean) => void;
}

const Checkbox: React.FC<Props> = props => {
    const [checked, setChecked] = React.useState(false);

    const handleChange = () => {
        setChecked(!checked);

        if (props.onChange) {
            props.onChange(!checked);
        }
    };

    return (
        <div className={`${styles.wrap} ${props.className}`}>
            <input
                id={props.label}
                className={styles.checkbox}
                type="checkbox"
                checked={checked}
                onChange={handleChange}
            />
            <label htmlFor={props.label} className={styles.label}>
                {props.label}
            </label>
        </div>
    );
};

Checkbox.defaultProps = {
    className: "",
    label: "Change me",
};

export default Checkbox;
