import React, { useState } from 'react';
import InvoiceForm from './components/InvoiceForm';
import InvoiceList from './components/InvoiceList';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    const [activeTab, setActiveTab] = useState('create');

    return (
        <div className="container mt-5">
            <h1 className="text-center text-primary mb-4">Krishna Saraswati Hall Invoice Manager</h1>
            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'create' ? 'active' : ''}`}
                        onClick={() => setActiveTab('create')}
                    >
                        Create Invoice
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'view' ? 'active' : ''}`}
                        onClick={() => setActiveTab('view')}
                    >
                        View Invoices
                    </button>
                </li>
            </ul>
            {activeTab === 'create' ? <InvoiceForm /> : <InvoiceList />}
        </div>
    );
};

export default App;
