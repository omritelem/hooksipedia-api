const mongoose = require('mongoose');
const mongoosePagination = require('mongoose-paginate');

const repositoriesSchema =  mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    owner: {
        id: Number,
        login: String,
        avatar_url: String,
    },
    created_at: Date,
    updated_at: Date,
    html_url: String,
    homepage: String,
    description: String,
    stargazers_count: Number,
    watchers_count: Number,
    forks_count: Number,
    topics: [{
        type: String,
    }],
});

repositoriesSchema.plugin(mongoosePagination);

module.exports = mongoose.model('Repositories', repositoriesSchema);
