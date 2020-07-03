const axios = require('axios');
const { RepositoriesModel } = require('../Models/Repositories');
const { DEFAULT_PAGE, DEFAULT_RESULTS_PER_PAGE } = require('../Constants/Repositories');
const { GENERAL_ERROR } = require('../Constants/StatusCodes');

const API_URL = 'https://api.github.com/search/repositories';
const HEADERS = 'application/vnd.github.mercy-preview+json';
const COUNT_PER_PAGE = 100;
const QUERY = 'use+topic:react-hooks';

const getRepositoriesByPage = async (req, res, next) => {
    try {
        const { name, page, perPage } = req.query;
        const queryFilter = name ? {name : {$regex : `.*${name}.*`}} : {};
        const options = {
            page: parseInt(page, 10) || DEFAULT_PAGE,
            limit: parseInt(perPage, 10) || DEFAULT_RESULTS_PER_PAGE,
            sort: {
                stargazers_count: -1
            },
        };
        const repos = await RepositoriesModel.paginate(queryFilter, options);
        return res.json(repos);
    } catch (err) {
        console.error(err);
        res.status(GENERAL_ERROR).send(err);
    }
};

const saveAllRepositories = async (req, res, next) => {
    getAllRepositories(1, [])
        .then(result => enrichRepositoriesData(result))
        .then(result => saveReposToDB(result))
        .then(result => res.json(result))
        .catch((error) => writeToLog(res, error))
};

const fetchAllRepositories = async (req, res, next) => {
    getAllRepositories(1, [])
        .then(result => enrichRepositoriesData(result))
        .then(result => res.json(result))
        .catch((error) => res.json({error}));
};

const runJob = () => {
    getAllRepositories(1, [])
        .then(result => enrichRepositoriesData(result))
        .then(result => saveReposToDB(result))
        .then(result => writeToLog(`${result && result.length} rows updated`))
        .catch((error) => writeToLog(error));
};

const timeOutPromise = () => new Promise((resolve) => setTimeout(resolve, 3000));

const getAllRepositories = (page, repos) => {
    return Promise.all([
        axios.get(`${ API_URL }?client_id=${ process.env.CLIENT_ID }&client_secret=${ process.env.CLIENT_SECRET }&per_page=${ COUNT_PER_PAGE }&page=${ page }&q=${ QUERY }`,
            { headers: { Accept: HEADERS } }), timeOutPromise])
        .then((response) => {
            const res = response[0];
            const items = res.data.items;
            const allRepos = [...repos, ...items];
            if (items.length) {
                return getAllRepositories(page + 1, allRepos);
            }
            return allRepos;
        }).catch(error => Promise.reject(error));
};

const enrichRepositoriesData = repos => {
    console.log('preparing repositories data..');
    return Promise.resolve(repos.map(repo => ({
        id: repo.id,
        name: repo.name,
        owner: {
            id: repo.owner.id,
            login: repo.owner.login,
            avatar_url: repo.owner.avatar_url,
        },
        html_url: repo.html_url,
        homepage: repo.homepage,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        description: repo.description,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        topics: repo.topics,
    })));
};

const saveReposToDB = repos => {
    console.log('running save repos to db.. - count', repos.length);
    const bulk = mongoose.models.Repositories.collection.initializeUnorderedBulkOp();
    for (const repo of repos) {
        bulk.find( { id: repo.id } ).upsert().replaceOne(repo);
    }
    return bulk.execute()
        .then(() => repos)
        .catch(err => console.log(err));
};

const writeToLog = description => {
    const log = new LogsModel({
        date: new Date(),
        description,
    });

    log.save()
        .then(data => console.log('log written',  data))
        .catch(err => console.log('Error occurred', err));
};

module.exports = {
    getRepositoriesByPage,
    fetchAllRepositories,
    saveAllRepositories,
    runJob,
};
