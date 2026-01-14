const http = require('http');
const url = require('url');
const fs = require('fs');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const tempOverview = fs.readFileSync(`${__dirname}/template/overview_template.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/template/product_template.html`, 'utf-8')
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
    const pathName = req.url;
    //OVERVIEW PAGE
    if(pathName === '/' || pathName === '/Home') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(tempOverview)
    }
    //PRODUCT PAGE
    else if(pathName === '/Products') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('<h1>Products Page</h1>')
    }
    //API PAGE
    else if(pathName === '/api'){
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(data);
    }
    else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end("404 Page Not Found");
    }
})
 server.listen(3000, "127.0.0.1", () => {
     console.log(`Server started on port 3000`);
 });
