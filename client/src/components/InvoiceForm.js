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
        <div className="card shadow p-4 border-0">
            <h2 className="text-center text-primary mb-4">Create New Invoice</h2>
            <form onSubmit={handleSubmit}>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Invoice ID</label>
                        <input
                            type="text"
                            className="form-control"
                            name="id"
                            value={formData.id}
                            onChange={handleChange}
                            placeholder="Enter Invoice ID"
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Customer Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter Customer Name"
                            required
                        />
                    </div>
                </div>
                <div className="row g-3 mt-3">
                    <div className="col-md-6">
                        <label className="form-label">Contact Number</label>
                        <input
                            type="text"
                            className="form-control"
                            name="contact"
                            value={formData.contact}
                            onChange={handleChange}
                            placeholder="Enter Contact Number"
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Amount</label>
                        <input
                            type="number"
                            className="form-control"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="Enter Amount"
                            required
                        />
                    </div>
                </div>
                <div className="row g-3 mt-3">
                    <div className="col-md-6">
                        <label className="form-label">Date of Booking</label>
                        <div style={{ marginTop: '8px' }}>
                        <DatePicker
                            selected={formData.dateOfBooking}
                            onChange={(date) => handleDateChange('dateOfBooking', date)}
                            className="form-control"
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Select Date of Booking"
                            required
                        />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Event Date</label>
                        <div style={{ marginTop: '8px' }}>
                            <DatePicker
                                selected={formData.eventDate}
                                onChange={(date) => handleDateChange('eventDate', date)}
                                className="form-control"
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Select Event Date"
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-3">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter Description"
                        rows="3"
                        required
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-100 mt-4">
                    Submit Invoice
                </button>
            </form>
        </div>
    );
};

export default InvoiceForm;
