const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    id: String,
    name: String,
    contact: String,
    description: String,
    amount: Number,
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
