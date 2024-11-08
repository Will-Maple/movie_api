const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Director: {
        Name: String,
        Bio: String
    },
    Description: {type: String, required: true},
    URL: {type: String, required: true},
    Subs:{
        Spanish: Boolean,
        SpanishURL: String
    },
    Genre: {
        Name: String,
        Description: String
    },
});

let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    Favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;