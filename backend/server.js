// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const Invoice = require('./models/Invoice');

// const app = express();

// // Middleware
// app.use(bodyParser.json());
// app.use(cors());

// // MongoDB Connection
// mongoose.connect('mongodb://localhost:27017/invoices', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }).then(() => console.log('MongoDB Connected'))
//   .catch(err => console.log(err));

// // Start Server
// const PORT = 5000;
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// // Create Invoice
// app.post('/invoices', async (req, res) => {
//   const invoice = new Invoice(req.body);
//   try {
//       await invoice.save();
//       res.status(201).send(invoice);
//   } catch (error) {
//       res.status(400).send(error);
//   }
// });

// // Get All Invoices
// app.get('/invoices', async (req, res) => {
//   try {
//       const invoices = await Invoice.find();
//       res.status(200).send(invoices);
//   } catch (error) {
//       res.status(500).send(error);
//   }
// });

// // Get Invoice by ID
// app.get('/invoices/:id', async (req, res) => {
//   try {
//       const invoice = await Invoice.findById(req.params.id);
//       if (!invoice) return res.status(404).send();
//       res.status(200).send(invoice);
//   } catch (error) {
//       res.status(500).send(error);
//   }
// });

// // Update Invoice
// app.put('/invoices/:id', async (req, res) => {
//   try {
//       const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
//       if (!invoice) return res.status(404).send();
//       res.status(200).send(invoice);
//   } catch (error) {
//       res.status(400).send(error);
//   }
// });

// // Delete Invoice
// app.delete('/invoices/:id', async (req, res) => {
//   try {
//       const invoice = await Invoice.findByIdAndDelete(req.params.id);
//       if (!invoice) return res.status(404).send();
//       res.status(200).send(invoice);
//   } catch (error) {
//       res.status(500).send(error);
//   }
// });













require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const Invoice = require('./models/Invoice');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Atlas Connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit the app if the database connection fails
    }
};

connectDB();

// Routes

// Create Invoice
app.post('/invoices', async (req, res) => {
    const { id, name, contact, description, amount, dateOfBooking, eventDate } = req.body;

    const invoice = new Invoice({
        id,
        name,
        contact,
        description,
        amount,
        dateOfBooking,
        eventDate,
    });

    try {
        await invoice.save();
        res.status(201).send(invoice);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// Get All Invoices
app.get('/invoices', async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.status(200).send(invoices);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Get Invoices by Year, Month, Name, and Event Date
app.get('/invoices/sort', async (req, res) => {
    const { year, month, name, eventDate } = req.query;
    const filters = {};

    // Filter by year
    if (year) {
        filters.dateOfBooking = { $gte: new Date(`${year}-01-01`), $lt: new Date(`${parseInt(year) + 1}-01-01`) };
    }

    // Filter by month (requires year to be provided)
    if (month && year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        filters.dateOfBooking = { $gte: startDate, $lt: endDate };
    }

    // Filter by name (case-insensitive)
    if (name) {
        filters.name = { $regex: name, $options: 'i' }; // 'i' makes it case-insensitive
    }

    // Filter by eventDate
    if (eventDate) {
        const date = new Date(eventDate);
        filters.eventDate = { $eq: date };
    }

    try {
        const invoices = await Invoice.find(filters);
        res.status(200).send(invoices);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Get Invoice by ID
app.get('/invoices/:id', async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) return res.status(404).send({ message: 'Invoice not found' });
        res.status(200).send(invoice);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Update Invoice
app.put('/invoices/:id', async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!invoice) return res.status(404).send({ message: 'Invoice not found' });
        res.status(200).send(invoice);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// Delete Invoice
app.delete('/invoices/:id', async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndDelete(req.params.id);
        if (!invoice) return res.status(404).send({ message: 'Invoice not found' });
        res.status(200).send(invoice);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
