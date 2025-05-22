import React from "react";
import { ParameterProperty } from "./types";

interface ParameterPropertiesEditorProps {
    properties: ParameterProperty[];
    values: Record<string, any>;
    onChange: (newValues: Record<string, any>) => void;
}

const ParameterPropertiesEditor: React.FC<ParameterPropertiesEditorProps> = ({
                                                                                 properties,
                                                                                 values,
                                                                                 onChange,
                                                                             }) => {
    const handleChange = (key: string, value: any) => {
        onChange({ ...values, [key]: value });
    };

    return (
        <div style={{ marginTop: "1rem" }}>
            <h4>Properties</h4>
            {properties.map(({ name, dataType, defaultValue, description }) => {
                const value = values[name] ?? defaultValue ?? "";
                const isBoolean = dataType === "boolean";
                const isNumber = dataType === "number";

                return (
                    <div key={name} style={{ marginBottom: "0.5rem" }}>
                        <label>
                            {name} ({dataType})
                            <br />
                            <input
                                type={isBoolean ? "checkbox" : isNumber ? "number" : "text"}
                                checked={isBoolean ? Boolean(value) : undefined}
                                value={!isBoolean ? value : undefined}
                                onChange={(e) =>
                                    handleChange(
                                        name,
                                        isBoolean
                                            ? e.target.checked
                                            : isNumber
                                                ? Number(e.target.value)
                                                : e.target.value
                                    )
                                }
                                style={{ marginTop: "0.25rem", marginLeft: "0.25rem" }}
                            />
                        </label>
                        {description && (
                            <div style={{ fontSize: "0.8rem", color: "#555" }}>
                                {description}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default ParameterPropertiesEditor;
