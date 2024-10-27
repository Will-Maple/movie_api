const express = require('express');
const app = express();

app.get('/movies', (req, res) => {
    res.json(movies);
});

app.listen(8080, () => {
    console.log('8080 - Your app is listening...')
})