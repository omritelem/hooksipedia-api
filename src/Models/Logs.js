const mongoose = require('mongoose');

const LogsSchema = mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    description: {
        type: String,
    },
});

const Logs = mongoose.model('Logs', LogsSchema);
module.exports = Logs;
