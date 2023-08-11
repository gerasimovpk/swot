const mongoose = require('mongoose');

const swotSchema = new mongoose.Schema({
    request: {
        type: Object, // You can be more specific here if needed
        required: true,
    },
    response: {
        type: Object, // Again, be more specific if needed
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('SWOT', swotSchema);
