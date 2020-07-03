const mongoose = require('mongoose');

const connectDb = callback => {
    mongoose.connect(
		// process.env.DATABASE_URL,
		'mongodb+srv://omri_telem:35am7hwsoeS@cluster0-byakh.mongodb.net/Hooksipedia?retryWrites=true&w=majority',
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
