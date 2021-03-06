const mongoose = require('mongoose');
require('dotenv/config');

const connectDb = callback => {
    mongoose.connect(
        process.env.MONGO_URL,
        {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        }, () => {
		    console.log('connected to db');
            callback();
        })
        .catch(err => {
            console.log('error', err);
            process.exit(1);
        });
};

module.exports = {
    connectDb,
};
