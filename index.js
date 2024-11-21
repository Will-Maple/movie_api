const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path'),
    bodyParser = require('body-parser'),
    uuid = require('uuid'),
    mongoose = require('mongoose'),
    Models = require('./models.js');

const app = express(),
    accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });

const Movies = Models.Movie,
    Users = Models.User;
/*mongoose.connect('mongodb://localhost:27017/csmfdb' );*/
mongoose.connect(process.env.CONNECTION_URI);

app.use(morgan('combined', { stream: accessLogStream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://placeholder.com'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            let message = 'The CORS policy for this application doesn\'t allow access from this origin ' + origin;
            return callback(new Error(message), false);
        }
        return callback(null, true);
    }
}))

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

const { check, validationResult } = require('express-validator');

// Read Documentation
app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '/public/documentation.yaml'));
})

// Read All Users
app.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.find()
        .then((users) => {
            res.status(200).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Get User by Username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' not found');
            } else {
                res.status(200).json(user);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Create User
app.post('/users',
    [
        check('Username', 'Username must be 5 or more characters').isLength({ min: 5 }),
        check('Username', 'Username contatins non-allowed characters').isAlphanumeric(),
        check('Password', 'Password is required').isLength({ min: 8 }),
        check('Email', 'This is not an Email').isEmail(),
        check('Birthday', 'Must be in YYYY-MM-DD format').isISO8601().toDate()
    ],
    async (req, res) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let hashedPassword = Users.hashPassword(req.body.Password);
        await Users.findOne({ Username: req.body.Username })
            .then((user) => {
                if (user) {
                    return res.status(400).send(req.body.Username + ' already exists');
                } else {
                    Users
                        .create({
                            Username: req.body.Username,
                            Password: hashedPassword,
                            Email: req.body.Email,
                            Birthday: req.body.Birthday
                        })
                        .then((user) => { res.status(201).json(user) })
                        .catch((error) => {
                            console.error(error);
                            res.status(500).send('Error: ' + error);
                        })
                }
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            });
    });

// Update User by Username
app.put('/users/:Username',
    [
        check('Username', 'Username must be 5 or more characters').isLength({ min: 5 }),
        check('Username', 'Username contatins non-allowed characters').isAlphanumeric(),
        check('Password', 'Password is required').isLength({ min: 8 }),
        check('Email', 'This is not an Email').isEmail(),
        check('Birthday', 'Must be in YYYY-MM-DD format').isISO8601().toDate()
    ],
    passport.authenticate('jwt', { session: false }), async (req, res) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        if (req.user.Username !== req.params.Username) {
            return res.status(400).send('Permission denied');
        }

        let hashedPassword = Users.hashPassword(req.body.Password);
        await Users.findOneAndUpdate({ Username: req.params.Username },
            {
                $set: {
                    Username: req.body.Username,
                    Password: hashedPassword,
                    Email: req.body.Email,
                    Birthday: req.body.Birthday
                }
            },
            { new: true })
            .then((updatedUser) => {
                if (!updatedUser) {
                    res.status(400).send(req.params.Username + ' - there is no such user');
                } else {
                    res.status(200).json(updatedUser);
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            })
    });

// Delete User by Username
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOneAndDelete({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' was not found');
            } else {
                res.status(200).send(req.params.Username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Read all Movies
app.get('/movies', async (req, res) => {
    await Movies.find()
        .then((movies) => {
            res.status(200).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Read Movie by Title
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne({ Title: req.params.title })
        .then((movie) => {
            if (!movie) {
                res.status(400).send(req.params.title + ' not found');
            } else {
                res.status(200).json(movie);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Read Genre
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne({ 'Genre.Name': req.params.genreName })
        .then((movie) => {
            if (!movie) {
                res.status(400).send(req.params.genreName + ' not found');
            } else {
                res.status(200).json(movie.Genre);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Read Director
app.get('/movies/director/:directorName', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne({ 'Director.Name': req.params.directorName })
        .then((movie) => {
            if (!movie) {
                res.status(400).send(req.params.directorName + ' not found');
            } else {
                res.status(200).json(movie.Director);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Create Favorite Movie by Username and MovieID
app.post('/users/:Username/movies/:movieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username },
        {
            $addToSet: { Favorites: req.params.movieID }
        },
        { new: true })
        .then((updatedUser) => {
            if (!updatedUser) {
                res.status(400).send(req.params.Username + ' not found');
            } else {
                res.status(201).send(req.params.movieID + ' has been added to ' + req.params.Username + '\'s favorites');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// delete favorite movie by Username and MovieID
app.delete('/users/:Username/movies/:movieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username },
        {
            $pull: { Favorites: req.params.movieID }
        },
        { new: true })
        .then((updatedUser) => {
            if (!updatedUser) {
                res.status(400).send(req.params.Username + ' not found');
            } else {
                res.status(201).send(req.params.movieID + ' has been removed from ' + req.params.Username + '\'s favorites');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log(port + ' ...your app is listening');
});