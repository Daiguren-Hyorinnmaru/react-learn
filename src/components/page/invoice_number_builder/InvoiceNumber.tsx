import React, {useState, useEffect} from "react";
import ParameterList from "./ParameterList";
import ParameterEditor from "./ParameterEditor";
import {ParameterInstance, ParameterType} from "./types";
import {v4 as uuidv4} from "uuid";
import ParameterPreview from "./ParameterPreview";
import InvoiceNumberTestUploader from "./InvoiceNumberTestUploader";

const InvoiceNumber: React.FC = () => {
    const [parameterTypes, setParameterTypes] = useState<ParameterType[]>([]);
    const [parameters, setParameters] = useState<ParameterInstance[]>([]);
    const [selectedParameterId, setSelectedParameterId] = useState<string | null>(null);
    const [previewStringParameters, setPreviewStringParameters] = useState("");

    useEffect(() => {
        fetch("http://localhost:8080/api/invoice-number/parameters")
            .then((res) => res.json())
            .then((data: ParameterType[]) => setParameterTypes(data))
            .catch((error) => console.error("Failed to fetch parameter types:", error));
    }, []);

    const selectedParameter = parameters.find((p) => p.id === selectedParameterId) || null;

    const updateParameter = (updated: ParameterInstance) => {
        setParameters((prev) =>
            prev.map((p) => (p.id === updated.id ? updated : p))
        );
    };

    const addParameter = () => {
        const newParam: ParameterInstance = {
            id: uuidv4(),
            name: "",
            typeCode: "",
            propertyValues: {},
            rules: [],
        };
        setParameters((prev) => [...prev, newParam]);
        setSelectedParameterId(newParam.id);
    };

    const deleteParameter = (idToDelete: string) => {
        setParameters((prev) =>
            prev
                // Удаляем сам параметр
                .filter((p) => p.id !== idToDelete)
                // Удаляем все правила, где dependsOn — это удаляемый id
                .map((p) => ({
                    ...p,
                    rules: p.rules.filter((r) => r.dependsOn !== idToDelete),
                }))
        );

        // Если удаляемый параметр был выбран — сбрасываем выбор
        setSelectedParameterId((prevId) => (prevId === idToDelete ? null : prevId));
    };

    const moveParameter = (id: string, direction: "up" | "down") => {
        setParameters((prev) => {
            const index = prev.findIndex((p) => p.id === id);
            if (index === -1) return prev;

            const newIndex = direction === "up" ? index - 1 : index + 1;
            if (newIndex < 0 || newIndex >= prev.length) return prev;

            const newParams = [...prev];
            // меняем местами элементы
            [newParams[index], newParams[newIndex]] = [newParams[newIndex], newParams[index]];
            return newParams;
        });
    };

    const previewString = parameters.map(p => `{${p.name || "No name"}}`).join("");

    return (
        <div>
            <div style={{display: "flex", padding: "1.5rem", gap: "2rem"}}>
                <ParameterPreview parameters={parameters}
                                  onChange={(value) => setPreviewStringParameters(value)}/>
            </div>
            <div style={{display: "flex", padding: "1.5rem", gap: "2rem"}}>
                <ParameterList
                    parameters={parameters}
                    selectedParameterId={selectedParameterId}
                    onSelectParameter={setSelectedParameterId}
                    onAddParameter={addParameter}
                    onDeleteParameter={deleteParameter}
                    onMoveParameter={moveParameter}
                />

                <ParameterEditor
                    parameter={selectedParameter}
                    onChange={updateParameter}
                    parameterTypes={parameterTypes}
                    parameters={parameters}
                />
                <InvoiceNumberTestUploader parameters={parameters} previewString={previewStringParameters}/>
            </div>
        </div>
    );
};

export default InvoiceNumber;
