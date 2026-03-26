const mongoose = require('mongoose');

// Wallet Schema
const walletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    balance: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        required: true
    },
    transactionHistory: [{
        type: Object,
        amount: { type: Number },
        date: { type: Date, default: Date.now },
        type: { type: String, enum: ['credit', 'debit'], required: true }
    }],
}, { timestamps: true });

// Wallet Model
const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;