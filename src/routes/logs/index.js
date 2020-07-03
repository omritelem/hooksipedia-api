const express = require('express');
const router = express.Router();
const { LogsModel } = require('../../models/Logs');

router.get('/', async (req, res) => {
    const result = await LogsModel.find({});
    res.json(result);
});

module.exports = router;
