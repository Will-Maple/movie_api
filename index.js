const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path');

const app = express(),
    accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});

app.use(morgan('combined', {stream: accessLogStream}));

app.get('/', (req, res) => {
    res.send('Boo! Halloween, Boo!!');
})

app.get('/movies', (req, res) => {
    res.json({Movie1: {
        Title: "Shadows of Our Forgotton Anscestors",
        Year: "1964"
    },
    Movie2: {
        Title: "Visitor of a Museum",
        Year: "1989"
    },
    Movie3: {
        Title: "Mothlight",
        Year: "1963"
    },
    Movie4: {
        Title: "News from Home",
        Year: "1977"
    },
    Movie5: {
        Title: "J'accuse!",
        Year: "1919"
    },
    Movie6: {
        Title: "Marketa Lazarova",
        Year: "1967"
    },
    Movie7: {
        Title: "Tokyo Story",
        Year: "1953"
    },
    Movie8: {
        Title: "The Mirror",
        Year: "1975"
    },
    Movie9: {
        Title: "Ordet",
        Year: "1955"
    },
    Movie10: {
        Title: "Pastor: To Die in the Country",
        Year: "1974"
    }
});
});

app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(8080, () => {
    console.log('8080 - Your app is listening...')
})