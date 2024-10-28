const express = require('express');
const app = express();

let myLogger = (req, res, next) => {
    console.log (req.url);
    next();
};

let requestTime = (req, res, next) => {
    req.requestTime = Date.now();
    next();
}

app.use(myLogger);
app.use(requestTime);

app.get('/movies', (req, res) => {
    res.json(movies);
});

app.listen(8080, () => {
    console.log('8080 - Your app is listening...')
})