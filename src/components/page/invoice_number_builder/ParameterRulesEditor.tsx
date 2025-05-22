import React, { useState } from "react";
import {
    ParameterInstance,
    ParameterType,
    Rule,
} from "./types";
import CustomSelect from "./CustomSelect";

interface ParameterRulesEditorProps {
    currentParameter: ParameterInstance;
    allParameters: ParameterInstance[];
    parameterTypes: ParameterType[];
    onChange: (updated: ParameterInstance) => void;
}

const ParameterRulesEditor: React.FC<ParameterRulesEditorProps> = ({
                                                                       currentParameter,
                                                                       allParameters,
                                                                       parameterTypes,
                                                                       onChange,
                                                                   }) => {
    const [targetParamId, setTargetParamId] = useState("");
    const [conditionCode, setConditionCode] = useState("");
    const [actionCode, setActionCode] = useState("");

    const targetParam = allParameters.find((p) => p.id === targetParamId);
    const targetType = parameterTypes.find((pt) => pt.code === targetParam?.typeCode);
    const currentType = parameterTypes.find((pt) => pt.code === currentParameter.typeCode);

    const addRule = () => {
        if (!actionCode) return;
        const newRule: Rule = {
            action: actionCode,
            dependsOn: targetParam?.name || "",
            when: conditionCode,
        };
        onChange({ ...currentParameter, rules: [...(currentParameter.rules || []), newRule] });
        setTargetParamId("");
        setConditionCode("");
        setActionCode("");
    };

    const removeRule = (idx: number) => {
        const updated = [...(currentParameter.rules || [])];
        updated.splice(idx, 1);
        onChange({ ...currentParameter, rules: updated });
    };

    return (
        <div>
            <h4>Rules (Conditions & Actions)</h4>

            <label>
                Parameter for condition:
                <select
                    value={targetParamId}
                    onChange={(e) => {
                        setTargetParamId(e.target.value);
                        setConditionCode("");
                        setActionCode("");
                    }}
                    style={{ marginLeft: 8 }}
                >
                    <option value="">-- Select --</option>
                    {allParameters.filter((p) => p.id !== currentParameter.id).map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
            </label>

            {targetParamId && targetType?.supportedConditions.length ? (
                <label style={{ marginLeft: 12 }}>
                    Condition:
                    <CustomSelect
                        options={targetType.supportedConditions}
                        selectedCode={conditionCode}
                        onChange={setConditionCode}
                    />

                    {conditionCode && (
                        <div style={{ marginTop: 4, fontSize: '0.875rem', color: '#555' }}>
                            {
                                targetType.supportedConditions.find((c) => c.code === conditionCode)?.description
                            }
                        </div>
                    )}

                </label>
            ) : null}

            {targetParamId && currentType?.supportedActions.length ? (
                <label style={{ marginLeft: 12 }}>
                    Action:
                    <select
                        value={actionCode}
                        onChange={(e) => setActionCode(e.target.value)}
                        style={{ marginLeft: 8 }}
                    >
                        <option value="">-- Select --</option>
                        {currentType.supportedActions.map((a) => (
                            <option key={a.code} value={a.code}>{a.label}</option>
                        ))}
                    </select>
                </label>
            ) : null}

            <button
                style={{ marginLeft: 12 }}
                disabled={!actionCode || !conditionCode}
                onClick={addRule}
            >
                Add Rule
            </button>

            <hr />

            <h5>Current Rules:</h5>
            {currentParameter.rules && currentParameter.rules.length ? (
                <ul>
                    {currentParameter.rules.map((rule, idx) => {
                        const dependsOnParam = allParameters.find((p) => p.id === rule.dependsOn);
                        const dependsOnType = parameterTypes.find((pt) => pt.code === dependsOnParam?.typeCode);
                        const conditionLabel = dependsOnType?.supportedConditions.find(c => c.code === rule.when)?.label || rule.when;
                        const actionLabel = currentType?.supportedActions.find(a => a.code === rule.action)?.label || rule.action;

                        return (
                            <li key={idx}>
                                <b>Action:</b> {actionLabel}, <b>Depends On:</b> {dependsOnParam?.name || rule.dependsOn}, <b>When:</b> {conditionLabel}{" "}
                                <button onClick={() => removeRule(idx)}>Remove</button>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p>No rules defined.</p>
            )}
        </div>
    );
};

export default ParameterRulesEditor;
