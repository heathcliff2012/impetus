const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Ticket = require('./models/Ticket');

const app = express();

// Middleware
app.use(cors(
    {
        origin: 'https://impetus-frontend.onrender.com',
        credentials: true
    }
));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/impetus-tickets')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- ROUTES ---

// 1. Create a new ticket
app.post('/api/tickets', async (req, res) => {
    try {
        const newTicket = new Ticket(req.body);
        const savedTicket = await newTicket.save();
        res.status(201).json(savedTicket);
    } catch (error) {
        console.error('Error creating ticket:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Duplicate Ticket Number and Event Name combination.' });
        }
        res.status(400).json({ message: error.message });
    }
});

// 2. Get all tickets (sorted by newest first)
app.get('/api/tickets', async (req, res) => {
    try {
        const tickets = await Ticket.find().sort({ createdAt: -1 });
        res.json(tickets);
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/tickets/duplicate', async (req, res) => {
    try {
        const { ticketNumber, eventName } = req.query;
        if (!ticketNumber || !eventName) {
            return res.json(false);
        }
        const tickets = await Ticket.find({ ticketNumber, eventName });
        if (tickets.length > 0) {
            return res.json(true);
        }
        else {
            return res.json(false);
        }
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ message: error.message });
    }
})

// 3. Get daily statistics
app.get('/api/tickets/stats', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today

        const statsPipeline = [
            {
                $match: {
                    createdAt: { $gte: today } // Only tickets created today
                }
            },
            {
                $facet: {
                    totals: [
                        {
                            $group: {
                                _id: null,
                                totalTickets: { $sum: 1 },
                                totalAmount: { $sum: '$amountPaid' }
                            }
                        }
                    ],
                    byType: [
                        {
                            $group: {
                                _id: '$ticketType',
                                count: { $sum: 1 }
                            }
                        }
                    ]
                }
            }
        ];

        const result = await Ticket.aggregate(statsPipeline);

        // Format response
        const totals = result[0].totals[0] || { totalTickets: 0, totalAmount: 0 };
        const byType = result[0].byType || [];

        // Reshape byType to an object for easy lookup
        const typeBreakdown = byType.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});

        res.json({
            today: today,
            totalTickets: totals.totalTickets,
            totalAmount: totals.totalAmount,
            typeBreakdown: typeBreakdown
        });

    } catch (error) {
        console.error('Error calculating stats:', error);
        res.status(500).json({ message: error.message });
    }
});

// 4. Delete a ticket
app.delete('/api/tickets/:id', async (req, res) => {
    try {
        const deletedTicket = await Ticket.findByIdAndDelete(req.params.id);
        if (!deletedTicket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        console.error('Error deleting ticket:', error);
        res.status(500).json({ message: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
