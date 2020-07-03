const mongoose = require('mongoose');

const connectDb = callback => {
    mongoose.connect(
		process.env.DATABASE_URL,
        {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        mongoose.connection.once('open', () => {
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
