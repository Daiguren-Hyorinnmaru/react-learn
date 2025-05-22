import React, {useState, useEffect} from "react";
import {ParameterInstance, ParameterType} from "./types";
import ParameterPropertiesEditor from "./ParameterPropertiesEditor";
import ParameterRulesEditor from "./ParameterRulesEditor";

interface ParameterEditorProps {
    parameter: ParameterInstance | null;
    onChange: (updatedParameter: ParameterInstance) => void;
    parameterTypes: ParameterType[];
    parameters: ParameterInstance[];
}

const ParameterEditor: React.FC<ParameterEditorProps> = ({
                                                             parameter,
                                                             onChange,
                                                             parameterTypes,
                                                             parameters,
                                                         }) => {
    const [localParameter, setLocalParameter] = useState<ParameterInstance | null>(parameter);

    useEffect(() => {
        setLocalParameter(parameter);
    }, [parameter]);

    if (!localParameter) {
        return <div>Select a parameter to edit</div>;
    }

    const handleChange = (updated: ParameterInstance) => {
        setLocalParameter(updated);
        onChange(updated);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalParameter({...localParameter, name: e.target.value});
    };

    const handleNameBlur = () => {
        if (localParameter) onChange(localParameter);
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newTypeCode = e.target.value;
        const selectedType = parameterTypes.find((type) => type.code === newTypeCode);
        if (!selectedType) return;

        const propertyValues = Object.fromEntries(
            selectedType.properties.map((prop) => [prop.name, prop.defaultValue ?? ""])
        );

        const updated = {
            ...localParameter,
            typeCode: newTypeCode,
            propertyValues,
        };

        handleChange(updated);
    };

    const handlePropertyChange = (newValues: Record<string, any>) => {
        handleChange({...localParameter, propertyValues: newValues});
    };

    const selectedType = parameterTypes.find(
        (type) => type.code === localParameter.typeCode
    );

    return (
        <div>
            <h3>Editing parameter</h3>

            <label style={{display: "block", marginBottom: "0.5rem"}}>
                Name:
                <input
                    type="text"
                    value={localParameter.name}
                    onChange={handleNameChange}
                    onBlur={handleNameBlur}
                    style={{marginLeft: "0.5rem"}}
                />
            </label>

            <label style={{display: "block", marginBottom: "1rem"}}>
                Type:
                <select
                    value={localParameter.typeCode || ""}
                    onChange={handleTypeChange}
                    style={{marginLeft: "0.5rem"}}
                >
                    <option value="" disabled>
                        -- Select type --
                    </option>
                    {parameterTypes.map((type) => (
                        <option key={type.code} value={type.code}>
                            {type.label}
                        </option>
                    ))}
                </select>
            </label>

            {selectedType && (
                <ParameterPropertiesEditor
                    properties={selectedType.properties}
                    values={localParameter.propertyValues}
                    onChange={handlePropertyChange}
                />
            )}

            <ParameterRulesEditor
                currentParameter={localParameter}
                allParameters={parameters}
                parameterTypes={parameterTypes}
                onChange={handleChange}
            />
            <h4 style={{ marginTop: "1rem" }}>Parameter full data:</h4>
            <pre>{JSON.stringify(localParameter, null, 2)}</pre>
        </div>
    );
};

export default ParameterEditor;
