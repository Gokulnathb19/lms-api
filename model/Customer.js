const mongoose = require('mongoose')

const CustomerSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    address: {
        street: {
            no: {
                type: Number,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            line1: {
                type: String,
                required: true
            },
            line2: String
        },
        district: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        pincode: {
            type: Number,
            required: true
        }
    },
    academics: [
        {
            school: {
                name: {
                    type: String,
                    required: true
                },
                location: {
                    type: String,
                    required: true
                }
            },
            course: {
                name: {
                    type: String,
                    required: true
                },
                type: {
                    type: String,
                    required: true
                },
            },
            percentge: {
                type: Number,
                required: true
            },
        }
    ],
    property: {
        type: String,
        required: true
    },
    familyIncome: {
        type: Number,
        required: true
    },
    documents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
    }],
    guaranteedBy: [String]
})

module.exports = mongoose.model('Customer', CustomerSchema)