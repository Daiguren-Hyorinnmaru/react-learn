import React from "react";
import { ParameterInstance } from "./types";

interface ParameterListProps {
    parameters: ParameterInstance[];
    selectedParameterId: string | null;
    onSelectParameter: (id: string) => void;
    onAddParameter: () => void;
    onDeleteParameter?: (id: string) => void;
    onMoveParameter?: (id: string, direction: "up" | "down") => void;
}

const ParameterList: React.FC<ParameterListProps> = ({
                                                         parameters,
                                                         selectedParameterId,
                                                         onSelectParameter,
                                                         onAddParameter,
                                                         onDeleteParameter,
                                                         onMoveParameter,
                                                     }) => (
    <div>
        <h3>Parameters</h3>
        <button onClick={onAddParameter}>Add parameter</button>
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {parameters.map(({ id, name }, index) => (
                <li
                    key={id}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        fontWeight: selectedParameterId === id ? "bold" : undefined,
                        marginBottom: 4,
                    }}
                >
                    <span
                        onClick={() => onSelectParameter(id)}
                        style={{ flexGrow: 1 }}
                    >
                        {name || "(No name)"}
                    </span>

                    {onMoveParameter && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onMoveParameter(id, "up");
                                }}
                                disabled={index === 0}
                                title="Move up"
                                style={{ marginLeft: 8 }}
                            >
                                ↑
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onMoveParameter(id, "down");
                                }}
                                disabled={index === parameters.length - 1}
                                title="Move down"
                                style={{ marginLeft: 4 }}
                            >
                                ↓
                            </button>
                        </>
                    )}

                    {onDeleteParameter && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteParameter(id);
                            }}
                            title="Delete parameter"
                            style={{ marginLeft: 8, color: "red" }}
                        >
                            ×
                        </button>
                    )}
                </li>
            ))}
        </ul>
    </div>
);

export default ParameterList;
