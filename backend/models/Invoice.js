const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    id: String,
    name: String,
    contact: String,
    description: String,
    amount: Number,
    dateOfBooking: { type: Date, required: false },
    eventDate: { type: Date, required: false },
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
