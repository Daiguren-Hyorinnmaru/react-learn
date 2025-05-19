import React, { useEffect, useState } from 'react';

type Props = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

function CurrencySelect({ value, onChange }: Props) {
    const [currencies, setCurrencies] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('http://localhost:8080/api/SumWorlds/Currency')
            .then(res => {
                if (!res.ok) throw new Error(res.statusText);
                return res.json();
            })
            .then(data => {
                setCurrencies(data);
                setLoading(false);
            })
            .catch(err => {
                setError(`Failed to load currencies: ${err.message}`);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading currencies...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <select
            id="currencySelect"
            className="form-select"
            value={value}
            onChange={onChange}
        >
            {currencies.map(c => (
                <option key={c} value={c}>{c}</option>
            ))}
        </select>
    );
}

export default CurrencySelect;
