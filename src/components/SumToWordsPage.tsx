import React, {useState} from 'react';
import CurrencySelect from "./CurrencySelect";
import LanguageSelect from "./LanguageSelect";

export default function SumToWordsPage() {
    const [amount, setAmount] = useState<string>(''); // input as string, parse later
    const [currency, setCurrency] = useState<string>('USD');
    const [language, setLanguage] = useState<string>('ENG');
    const [result, setResult] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSubmit = async () => {
        setError('');
        setResult('');

        const normalizedAmount = amount.replace(',', '.');
        const parsedAmount = parseFloat(normalizedAmount);

        if (isNaN(parsedAmount)) {
            setError('Please enter a valid number');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/SumWorlds?amount=${parsedAmount}&currency=${currency}&language=${language}`);
            if (!response.ok) {
                setError(String(`Error: ${response.statusText}`));
                return;
            }
            const text = await response.text();
            setResult(text);
        } catch (e) {
            setError(String(e));
        }
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;
        const regex = /^(\d{0,9})([.,]?\d{0,2})?$/;

        if (val === '' || regex.test(val)) {
            if (val.length < 10 || /[.,]/.test(val)) {
                setAmount(val);
                setResult('');
            }
        }
    };

    return (
        <div className="container p-4" style={{ maxWidth: 600 }}>
            <h2 className="mb-4">Convert Amount to Words</h2>

            <div className="mb-3">
                <label className="form-label" htmlFor="amountInput">Amount:</label>
                <input
                    id="amountInput"
                    type="text"
                    className="form-control"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="Enter a number"
                />
            </div>

            <div className="row mb-3">
                <div className="col-6">
                    <label className="form-label" htmlFor="currencySelect">Currency:</label>
                    <CurrencySelect value={currency} onChange={(e) => setCurrency(e.target.value)} />
                </div>
                <div className="col-6">
                    <label className="form-label" htmlFor="languageSelect">Language:</label>
                    <LanguageSelect value={language} onChange={(e) => setLanguage(e.target.value)} />
                </div>
            </div>

            <button
                className="btn btn-primary mb-3"
                onClick={handleSubmit}
                disabled={!amount}
            >
                Convert
            </button>

            {error && <div className="alert alert-danger">{error}</div>}
            {result && <div className="alert alert-success"><strong>Result:</strong> {result}</div>}
        </div>
    );
}
