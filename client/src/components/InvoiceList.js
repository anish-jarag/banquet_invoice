import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const InvoiceList = () => {
    const [invoices, setInvoices] = useState([]);
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');

    const fetchInvoices = async (filterYear, filterMonth) => {
        try {
            const response = await axios.get('http://localhost:5000/invoices/sort', {
                params: { year: filterYear, month: filterMonth },
            });
            setInvoices(response.data);
        } catch (error) {
            alert('Error fetching invoices');
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const handleSort = () => {
        fetchInvoices(year, month);
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
        const tableColumn = ['ID', 'Name', 'Contact', 'Description', 'Amount', 'Booking Date', 'Event Date'];
        const tableRows = invoices.map((invoice) => [
            invoice.id,
            invoice.name,
            invoice.contact,
            invoice.description,
            invoice.amount,
            invoice.dateOfBooking ? new Date(invoice.dateOfBooking).toLocaleDateString() : 'N/A',
            invoice.eventDate ? new Date(invoice.eventDate).toLocaleDateString() : 'N/A',
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

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-primary">Invoice List</h2>
                <div className="d-flex gap-3">
                    <select
                        className="form-select"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                    >
                        <option value="">Select Year</option>
                        {Array.from({ length: 5 }, (_, i) => {
                            const currentYear = new Date().getFullYear();
                            return (
                                <option key={i} value={currentYear - i}>
                                    {currentYear - i}
                                </option>
                            );
                        })}
                    </select>

                    <select
                        className="form-select"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                    >
                        <option value="">Select Month</option>
                        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(
                            (month, i) => (
                                <option key={i} value={i + 1}>
                                    {month}
                                </option>
                            )
                        )}
                    </select>

                    <button className="btn btn-primary" onClick={handleSort}>
                        Filter
                    </button>
                </div>
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
                        <th>Booking Date</th>
                        <th>Event Date</th>
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
                            <td>{invoice.dateOfBooking ? new Date(invoice.dateOfBooking).toLocaleDateString() : 'N/A'}</td>
                            <td>{invoice.eventDate ? new Date(invoice.eventDate).toLocaleDateString() : 'N/A'}</td>
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
