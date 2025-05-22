import React, {useEffect, useState} from "react";
import {NamedParameterWithSeparator, ParameterInstance} from "./types";

interface ParameterPreviewProps {
    parameters: ParameterInstance[];
    onChange: (previewString: string) => void;
}

const ParameterPreview: React.FC<ParameterPreviewProps> = ({
                                                               parameters,
                                                               onChange,
                                                           }) => {
    const [editableParams, setEditableParams] = useState<NamedParameterWithSeparator[]>([]);

    useEffect(() => {
        setEditableParams(
            parameters.map((p, index) => ({
                name: p.name || `No name ${index + 1}`,
                separator: "",
            }))
        );
    }, [parameters]);

    useEffect(() => {
        const preview = editableParams
            .map(({name, separator}) => `{${name}}${separator || ""}`)
            .join("");
        onChange(preview);
    }, [editableParams, onChange]);

    const handleSeparatorChange = (index: number, value: string) => {
        const updated = [...editableParams];
        updated[index].separator = value;
        setEditableParams(updated);
    };

    return (
        <div style={{marginTop: "1rem"}}>
            <div className="mb-2 font-semibold">Preview:</div>
            <div className="italic mb-4">
                {editableParams.map(({name, separator}, index) => (
                    <span key={index}>
            <span className="bg-gray-200 px-2 py-1 rounded mr-1">{`{${name}}`}</span>
                        {index < editableParams.length - 1 && (
                            <input
                                type="text"
                                className="border p-1 rounded text-center mr-2"
                                value={separator}
                                onChange={(e) => handleSeparatorChange(index, e.target.value)}
                                placeholder=""
                                style={{ width: `${Math.max(separator.length+1, 2)}ch` }}
                            />
                        )}
          </span>
                ))}
            </div>
        </div>
    );
};

export default ParameterPreview;
