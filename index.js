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

],
    movies = [
{
    Title: "Shadows of Our Forgotton Anscestors",
    Year: "1964"
},
{
    Title: "Visitor of a Museum",
    Year: "1989"
},
{
    Title: "Mothlight",
    Year: "1963"
},
{
    Title: "News from Home",
    Year: "1977"
},
{
    Title: "J'accuse!",
    Year: "1919"
},
{
    Title: "Marketa Lazarova",
    Year: "1967"
},
{
    Title: "Tokyo Story",
    Year: "1953"
},
{
    Title: "The Mirror",
    Year: "1975"
},
{
    Title: "Ordet",
    Year: "1955"
},
{
    Title: "Pastoral: To Die in the Country",
    Year: "1974"
}
];

app.get('/', (req, res) => {
    res.send('public/documentation.html');
})

//Read
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});

app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(8080, () => {
    console.log('8080 - Your app is listening...')
})