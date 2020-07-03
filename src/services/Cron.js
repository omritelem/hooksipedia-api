const { runJob } = require('./Repositories');
const cron = require('node-cron');

const jobExecution = () => {
    cron.schedule('0 0 * * * *', () => runJob());
};

module.exports = {
    jobExecution,
};
