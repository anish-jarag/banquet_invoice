import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './InvoiceList.css'; // Add a custom CSS file for minor styling tweaks

const InvoiceList = () => {
    const [invoices, setInvoices] = useState([]);
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [name, setName] = useState('');
    const [eventDate, setEventDate] = useState('');

    const fetchInvoices = async (filters = {}) => {
        try {
            const response = await axios.get('http://localhost:5000/invoices/sort', { params: filters });
            setInvoices(response.data);
        } catch (error) {
            alert('Error fetching invoices');
        }
    };

    useEffect(() => {
        fetchInvoices(); // Fetch all invoices initially
    }, []);

    const handleSort = () => {
        const filters = { year, month, name, eventDate };
        fetchInvoices(filters); // Apply filters
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
            <div className="d-flex flex-column align-items-center mb-4">
                <h2 className="text-primary fw-bold">Invoice Management</h2>
                <p className="text-muted">Filter and manage your invoices efficiently</p>
            </div>

            <div className="card p-4 shadow-sm mb-4">
                <div className="row gy-3 align-items-center">
                    <div className="col-md-3">
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
                    </div>
                    <div className="col-md-3">
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
                    </div>
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="date"
                            className="form-control"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                        />
                    </div>
                </div>

                <div className="d-flex justify-content-end mt-4">
                    <button className="btn btn-primary me-2" onClick={handleSort}>
                        Apply Filters
                    </button>
                    <button className="btn btn-success" onClick={exportPDF}>
                        Export PDF
                    </button>
                </div>
            </div>

            <div className="table-responsive shadow-sm mt-4">
    <table className="table table-striped table-bordered">
        <thead style={{ backgroundColor: '#343a40', color: '#f8f9fa' }}>
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
            {invoices.length > 0 ? (
                invoices.map((invoice) => (
                    <tr key={invoice._id} className="align-middle">
                        <td>{invoice.id}</td>
                        <td>{invoice.name}</td>
                        <td>{invoice.contact}</td>
                        <td>{invoice.description}</td>
                        <td>{`₹${parseFloat(invoice.amount).toFixed(2)}`}</td>
                        <td>
                            {invoice.dateOfBooking
                                ? new Date(invoice.dateOfBooking).toLocaleDateString()
                                : 'N/A'}
                        </td>
                        <td>
                            {invoice.eventDate
                                ? new Date(invoice.eventDate).toLocaleDateString()
                                : 'N/A'}
                        </td>
                        <td className="text-center">
                            <button
                                onClick={() => handleDelete(invoice._id)}
                                className="btn btn-danger btn-sm"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="8" className="text-center text-muted py-4">
                        <i className="fas fa-info-circle me-2"></i>No invoices found
                    </td>
                </tr>
            )}
        </tbody>
    </table>
</div>

        </div>
    );
};

export default InvoiceList;
