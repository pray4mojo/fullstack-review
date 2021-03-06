const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fetcher');

let repoSchema = mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true
  },
  owner: String,
  name: String,
  url: String,
  forks: Number
});

let Repo = mongoose.model('Repo', repoSchema);

let save = (repos, cb) => {
  if (Array.isArray(repos)) {
    repos.forEach(function(repo) {
      var newRepo = new Repo({
        id: repo.id,
        owner: repo.owner.login,
        name: repo.name,
        url: repo.html_url,
        forks: repo.forks_count
      });
      newRepo.save(function(err, newRepo) {
        if (err) {
          console.log('database/index.js save function: Duplicate entries not allowed');
        } else {
          console.log('new repo added to database');
        }
      });
    });
  }
  cb();
}

let retrieve = (cb) => {
  Repo.find((err, repos) => {
    if (err) {
      return console.error(err);
    }
    cb(repos);
  });
};

module.exports.save = save;
module.exports.retrieve = retrieve;