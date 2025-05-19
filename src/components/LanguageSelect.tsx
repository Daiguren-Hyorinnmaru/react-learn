import React, { useEffect, useState } from 'react';

type Props = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

function LanguageSelect({ value, onChange }: Props) {
    const [languages, setLanguages] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('http://localhost:8080/api/SumWorlds/Language')
            .then(res => {
                if (!res.ok) throw new Error(res.statusText);
                return res.json();
            })
            .then(data => {
                setLanguages(data);
                setLoading(false);
            })
            .catch(err => {
                setError(`Failed to load languages: ${err.message}`);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading languages...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <select
            id="languageSelect"
            className="form-select"
            value={value}
            onChange={onChange}
        >
            {languages.map(l => (
                <option key={l} value={l}>{l}</option>
            ))}
        </select>
    );
}

export default LanguageSelect;
