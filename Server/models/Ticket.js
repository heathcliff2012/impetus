const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    ticketNumber: {
        type: String,
        required: true,
        trim: true
    },
    ticketType: {
        type: String,
        required: true,
        enum: ['Flagship', 'non-flagship', 'lazer tag', 'all in one']
    },
    amountPaid: {
        type: Number,
        required: true,
        min: 0
    },
    paidTo: {
        type: String,
        required: true,
        trim: true
    },
    eventName: {
        type: String,
        required: true,
        trim: true
    },
    paidThrough: {
        type: String,
        required: true,
        enum: ['cash', 'UPI']
    }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

// Enforce that ticketNumber + eventName combined are absolutely unique
ticketSchema.index({ ticketNumber: 1, eventName: 1 }, { unique: true });

module.exports = mongoose.model('Ticket', ticketSchema);
