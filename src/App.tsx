import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Route, Routes, BrowserRouter, NavLink} from "react-router-dom";
import Home from "./components/page/home/Home";
import SumToWordsPage from "./components/page/sum_to_words/SumToWordsPage";
import InvoiceNumber from "./components/page/invoice_number_builder/InvoiceNumber";


function App() {
    return (
        <BrowserRouter>
            <div className="bg-dark text-light min-vh-100">
                <header className="bg-secondary p-3">
                    <nav className="nav">
                        <NavLink className="nav-link text-light" to="/">🏠 Home</NavLink>
                        <NavLink className="nav-link text-light" to="/sum-to-words">🔤 Sum To Words</NavLink>
                        <NavLink className="nav-link text-light" to="/invoice-number">🧾 Invoice number</NavLink>
                    </nav>
                </header>

                <main className="container py-4">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/sum-to-words" element={<SumToWordsPage />} />
                        <Route path="/invoice-number" element={<InvoiceNumber />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;
