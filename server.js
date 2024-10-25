const http = require('http'),
    url = require('url'),
    fs = require('fs');

http.createServer((request, response) => {

    let addr = request.url,
    q = new URL(addr, 'http://localhost:8080')
    filePath = '';

    if (q.pathname.includes('documentation')) {
        filePath = (__dirname + '/documentation.html');
        } else {
            filepath = 'index.html';
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            throw err;
        }
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end('I will have what she is having!\n'); 
    });

}).listen(8080);

console.log('My first Node test Server is running on Port 8080');