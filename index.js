const express = require('express'),
    morgan = require('morgan');

const app = express();

app.use(morgan('common'));

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