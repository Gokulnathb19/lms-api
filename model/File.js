var mongoose = require('mongoose')

var FileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    directoryPath: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        unique:  true,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    createdAt: Date
})

module.exports = mongoose.model('File', FileSchema)