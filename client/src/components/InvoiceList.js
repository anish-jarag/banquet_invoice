import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const InvoiceList = () => {
    const [invoices, setInvoices] = useState([]);

    const fetchInvoices = async () => {
        try {
            const response = await axios.get('http://localhost:5000/invoices');
            setInvoices(response.data);
        } catch (error) {
            alert('Error fetching invoices');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/invoices/${id}`);
            alert('Invoice deleted!');
            fetchInvoices(); // Refresh the list after deletion
        } catch (error) {
            alert('Error deleting invoice');
        }
    };

    const exportPDF = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(18);
        doc.text('Invoice List', 14, 22);

        // Table Headers and Rows
        const tableColumn = ['ID', 'Name', 'Contact', 'Description', 'Amount'];
        const tableRows = invoices.map((invoice) => [
            invoice.id,
            invoice.name,
            invoice.contact,
            invoice.description,
            invoice.amount,
        ]);

        // Add table to the PDF
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 30,
        });

        // Save the PDF
        doc.save('invoices.pdf');
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-primary">Invoice List</h2>
                <button
                    onClick={exportPDF}
                    className="btn btn-success"
                >
                    Export as PDF
                </button>
            </div>
            <table className="table table-hover table-bordered">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Contact</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice) => (
                        <tr key={invoice._id}>
                            <td>{invoice.id}</td>
                            <td>{invoice.name}</td>
                            <td>{invoice.contact}</td>
                            <td>{invoice.description}</td>
                            <td>{invoice.amount}</td>
                            <td>
                                <button
                                    onClick={() => handleDelete(invoice._id)}
                                    className="btn btn-danger btn-sm"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InvoiceList;
