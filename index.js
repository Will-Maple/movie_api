const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');

const app = express(),
    accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});

app.use(morgan('combined', {stream: accessLogStream}));
app.use(bodyParser.json());

let users = [
    {
        ID: "This is an example!",
        Name: "Me Myself",
        FavoriteMovies: {}
    }
];
    
let movies = [
    {
        Title: "Stalker",
        Year: 1979,
        Director: {
            Name: "Andrey Tarkovsky"
        },
        Description: "Based on the novel 'Roadside Picnic' by Arkady and Boris Strugatsky. The Zone that arose on Earth for unknown reasons attracts attention with inexplicable phenomena that occur there. A rumor has spread that in the center of the Zone there is something that gives a person everything he wants. But staying in the Zone is deadly, and therefore it is strictly guarded. There, each for their own reasons, the Writer and the Professor go, the Stalker leads them to the mysterious center, feeling and understanding the Zone...",
        URL: "https://www.youtube.com/watch?v=Q3hBLv-HLEc&list=PL7EqAsBxqGgjarBzACNmCNDdr0y0iFu8U",
        Subs: {
            Spanish: false,
            SpanishURL: "#"
        },
        Genre: {
            Name: "Drama",
            Description: "Dramas are narrative films lacking the characteristics of other genres."
        }
    },
    {
        Title: "Solaris",
        Year: 1972,
        Director: {
            Name: "Andrey Tarkovsky"
        },
        Description: "The Solaris mission has established a base on a planet that appears to host some kind of intelligence, but the details are hazy and very secret. After the mysterious demise of one of the three scientists on the base, the main character is sent out to replace him. He finds the station run-down and the two remaining scientists cold and secretive. When he also encounters his wife who has been dead for ten years, he begins to appreciate the baffling nature of the alien intelligence...",
        URL: "https://www.youtube.com/watch?v=Z8ZhQPaw4rE&list=PL7EqAsBxqGgjarBzACNmCNDdr0y0iFu8U&index=2",
        Subs: {
            Spanish: true,
            SpanishURL: "https://www.youtube.com/watch?v=r_fOakbPjyQ&list=PL7EqAsBxqGgjarBzACNmCNDdr0y0iFu8U&index=9"
        },
        Genre: {
            Name: "Science Fiction",
            Description: "Science Fictions are narrative films set in filmworlds significantly differentiated from our own by advanced technology or similar scientific counterfactuals."
        }
    },
    {
        Title: "Ivan's Childhood",
        Year: 1962,
        Director: {
            Name: "Andrey Tarkovsky"
        },
        Description: "Based on the story by V. Bogomolov 'Ivan'. The childhood of 12-year-old Ivan ends with the onset of the war. Left without parents, he goes to a military unit and becomes a scout, risking his life, getting information about the enemy. Victory. Defeated Berlin. But Ivan never returned from the last assignment...",
        URL: "https://www.youtube.com/watch?v=6Lnb1bI0VIk&list=PL7EqAsBxqGgjarBzACNmCNDdr0y0iFu8U&rco=1",
        Subs: {
            Spanish: false,
            SpanishURL: "#"
        },
        Genre: {
            Name: "War Movie",
            Description: "War Movies are narrative films set in war conflicts, typically based on historical conflicts."
        }
    },
    {
        Title: "The Mirror",
        Year: 1974,
        Director: {
            Name: "Andrey Tarkovsky"
        },
        Description: "'The Mirror' movie represents reflections, thoughts of the person named here as the Author. He does not appear personally, only his tired voice sounds. And on the screen, as if in a mirror, are pictures of his past. At first, the memories seem scattered: love for the mother, which the Author does not know how to express, a piercing feeling for the father, dissatisfaction with himself for the undeveloped relationship with his son ... Gradually it becomes clear - this is a person’s account of himself, a difficult judgment of conscience, maybe even a sentence. The film occupies a special place in the work of Andrei Tarkovsky. In it, he captured his aged mother Maria Ivanovna Vishnyakova-Tarkovsky, behind the scenes the voice of his father, the poet Arseny Tarkovsky, reciting his wonderful poems sounds. It's a confession film, a revelation film...",
        URL: "https://www.youtube.com/watch?v=NrMINC5xjMs&list=PL7EqAsBxqGgjarBzACNmCNDdr0y0iFu8U&index=4",
        Subs: {
            Spanish: true,
            SpanishURL: "https://www.youtube.com/watch?v=Mbj0ZTqVgOg&list=PL7EqAsBxqGgjarBzACNmCNDdr0y0iFu8U&index=7"
        },
        Genre: {
            Name: "Drama",
            Description: "Dramas are narrative films lacking the characteristics of other genres."
        }
    },
    {
        Title: "Andrei Rublev",
        Year: 1966,
        Director: {
            Name: "Andrey Tarkovsky"
        },
        Description: "The picture unfolds a wide panorama of the life in Russia at the beginning of the 15th century, when the Russian genius artist Andrei Rublev lived and worked. His creations showed the world a miracle of harmony, beauty, light, hope - and all this at a time when the country is torn apart by princely civil strife, and Tatar raids, famine and pestilence are chasing the people. The film is divided into eight short stories, which have little plot connection with each other, but paint a general picture of medieval Russia, which is taking shape like a mosaic work. The film was included in the 100 best films in the history of cinema, according to a survey of film critics of the world in 1978.",
        URL: "https://www.youtube.com/watch?v=je75FDjcUP4&list=PL7EqAsBxqGgjarBzACNmCNDdr0y0iFu8U&index=5",
        Subs: {
            Spanish: false,
            SpanishURL: "#"
        },
        Genre: {
            Name: "Drama",
            Description: "Dramas are narrative films lacking the characteristics of other genres."
        }
    }
];

app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '/public/documentation.yaml'));
})

//Read all
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});

app.get('/movies/test/:year', (req, res) => {
    res.json(movies.find((movie) =>
    { return String(movie.Year) === req.params.year}));
});

// Read title
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find( movie => movie.Title === title );

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('no such movie')
    }
});

// Read Genre
app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const findMovie = movies.find( movie => movie.Genre.Name === genreName);

    if (findMovie) {
        const genre = findMovie.Genre;
        res.status(200).json(genre);
    } else {
        res.status(400).send('no such genre')
    }
});

// Read Director
app.get('/movies/director/:directorName', (req, res) => {
    const { directorName } = req.params;
    const findMovie = movies.find( movie => movie.Director.Name === directorName);

    if (findMovie) {
        const director = findMovie.Name;
        res.status(200).json(director);
    } else {
        res.status(400).send('no such director')
    }
});

// Create User
app.post('/user', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser);
    } else {
        res.status(400).send('Needs a name!')
    }
});

// Update User
app.put('/user/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find( user => users.id === id);

    if (user) {
        user.Name = updatedUser.Name;
        res.status(200).json(user);
    } else {
        res.status(400).send('no user with that id')
    }
});

app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(8080, () => {
    console.log('8080 - Your app is listening...')
})