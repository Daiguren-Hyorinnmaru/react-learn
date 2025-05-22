import React, { useState } from 'react';
import { ParameterInstance } from "./types";

interface InvoiceNumberTestSenderProps {
    parameters: ParameterInstance[];
    previewString: string;
}

const InvoiceNumberTestSender: React.FC<InvoiceNumberTestSenderProps> = ({
                                                                             parameters,
                                                                             previewString
                                                                         }) => {
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        const pattern = buildPattern(previewString, parameters);

        const encodedPattern = encodeURIComponent(pattern);
        const url = `http://localhost:8080/api/invoice-number/test?patternContent=${encodedPattern}`;

        setLoading(true);
        setResult(null);

        try {
            const response = await fetch(url, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Error during the request');
            }

            const text = await response.text();
            setResult(text);
        } catch (error) {
            setResult(`Error: ${(error as Error).message}`);
        } finally {
            setLoading(false);
        }
    };

    const buildPattern = (preview: string, params: ParameterInstance[]): string => {
        const parameterMap: Record<string, any> = {};

        params.forEach(param => {
            if (!param.name || !param.typeCode) return;

            const paramData: Record<string, any> = {
                type: param.typeCode
            };

            // Copy propertyValues as flat properties
            Object.entries(param.propertyValues || {}).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    paramData[key] = value;
                }
            });

            // Add rules if present
            if (param.rules && param.rules.length > 0) {
                paramData.rules = param.rules.map(rule => ({
                    action: rule.action,
                    dependsOn: rule.dependsOn,
                    when: rule.when
                }));
            }

            parameterMap[param.name] = paramData;
        });

        const result = {
            pattern: preview,
            parameters: parameterMap
        };

        return JSON.stringify(result, null, 2);
    };


    return (
        <div className="p-4 border rounded shadow-md w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Invoice Number Generation Test</h2>
            <button
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                onClick={handleSend}
                disabled={loading}
            >
                {loading ? 'Sending...' : 'Generate and Send'}
            </button>
            {result && (
                <div className="mt-2 p-2 border rounded bg-green-100">
                    <strong>Response:</strong> {result}
                </div>
            )}
        </div>
    );
};

export default InvoiceNumberTestSender;
