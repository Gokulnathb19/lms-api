const mongoose = require('mongoose')

const loanDetails = {
    tentureSelected: {
        type: Number,
        required: true
    },
    interest: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['NEW', 'REJECTED', 'APPROVED'],
        default: 'NEW'
    },
    duration: {
        type: Number,
        required: true
    },
    reducingIntrestRate: {
        type: Boolean,
        default: false,
    },
    description: {
        type: String,
        required: true
    },
    loanType: {
        type: String,
        required: true
    }
}

const LoanSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    details: loanDetails,
    createdOn: {
        type: Date,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    lastUpdatedOn: {
        type: Date,
        required: true
    },
    lastUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    history: [{
        details: loanDetails,
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        updatedOn: {
            type: Date,
            required: true
        },
        __v: {
            type: Number,
            required: true
        }
    }]
})

module.exports = mongoose.model('Loan', LoanSchema)