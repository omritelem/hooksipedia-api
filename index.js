const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { connectDb } = require('./db');
require('dotenv/config');

const RepositoriesRoute = require('./src/routes/repositories/index');
const LogsRoute = require('./src/routes/logs/index');
const { jobExecution } = require('./src/services/Cron');

// Middleware's
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

// Health
app.get('/health', (req, res) => res.json({ health: 'ok' }));

// connect to db
connectDb(() => {
    // internal middleware

    // routers
    app.use('/repositories', RepositoriesRoute);
    app.use('/logs', LogsRoute);

    jobExecution();

    // Run server
    const serverPort = process.env.PORT || 8080;
    app.listen(serverPort, () => {
        console.log('servier listening on port', serverPort);
    });
});
