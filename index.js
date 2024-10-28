const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path');

const app = express(),
    accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});

app.use(morgan('combined', {stream: accessLogStream}));

app.get('/', (req, res) => {
    res.send('Boooooooooooo! Halloween!');
})

app.get('/movies', (req, res) => {
    let responseText = 'Boo! Halloween, Boo!'
    responseText += '<small>Requested at: ' + req.requestTime + '</small>';
    res.json(movies);
});

app.use('/documentation', express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(8080, () => {
    console.log('8080 - Your app is listening...')
})