const express = require('express');
const router = express.Router();

const { getRepositoriesByPage, fetchAllRepositories, saveAllRepositories } = require('../../Services/Repositories');

router.get('/', getRepositoriesByPage);

router.get('/fetch-all-repos', fetchAllRepositories);

router.use('/save-all-repos', saveAllRepositories);

module.exports = router;
