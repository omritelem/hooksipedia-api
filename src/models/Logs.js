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

const LogsModel = mongoose.model('Logs', LogsSchema);

module.exports = {
    LogsModel,
};
