import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const InvoiceForm = () => {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        contact: '',
        description: '',
        amount: '',
        dateOfBooking: new Date(), // Defaults to the current date
        eventDate: null,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDateChange = (field, date) => {
        setFormData({ ...formData, [field]: date });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Format dates to ISO strings for backend compatibility
            const payload = {
                ...formData,
                dateOfBooking: formData.dateOfBooking.toISOString(),
                eventDate: formData.eventDate ? formData.eventDate.toISOString() : null,
            };
            await axios.post('http://localhost:5000/invoices', payload);
            alert('Invoice created successfully!');
            setFormData({
                id: '',
                name: '',
                contact: '',
                description: '',
                amount: '',
                dateOfBooking: new Date(),
                eventDate: null,
            });
        } catch (error) {
            alert('Error creating invoice');
        }
    };

    return (
        <div className="card shadow-sm p-4">
            <h2 className="text-center text-secondary mb-4">Create New Invoice</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">ID</label>
                    <input
                        type="text"
                        className="form-control"
                        name="id"
                        value={formData.id}
                        onChange={handleChange}
                        placeholder="Enter invoice ID"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter customer name"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Contact</label>
                    <input
                        type="text"
                        className="form-control"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        placeholder="Enter contact details"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter invoice description"
                        rows="3"
                        required
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label className="form-label">Amount</label>
                    <input
                        type="number"
                        className="form-control"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="Enter amount"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Date of Booking</label>
                    <DatePicker
                        selected={formData.dateOfBooking}
                        onChange={(date) => handleDateChange('dateOfBooking', date)}
                        className="form-control"
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select date of booking"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Event Date</label>
                    <DatePicker
                        selected={formData.eventDate}
                        onChange={(date) => handleDateChange('eventDate', date)}
                        className="form-control"
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select event date"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                    Submit Invoice
                </button>
            </form>
        </div>
    );
};

export default InvoiceForm;
