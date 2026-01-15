const http = require('http');
const url = require('url');
const fs = require('fs');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const tempOverview = fs.readFileSync(`${__dirname}/template/overview_template.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/template/product_template.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/template/product_card_template.html`, 'utf-8')
const dataObj = JSON.parse(data);

const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{PRODUCT_NAME}/g, product.productName);
    output = output.replace(/{IMAGE}/g, product.image);
    output = output.replace(/{PRICE}/g, product.price);
    output = output.replace(/{FROM}/g, product.from);
    output = output.replace(/{NUTRIENTS}/g, product.nutrients);
    output = output.replace(/{QUANTITY}/g, product.quantity);
    output = output.replace(/{DESCRIPTION}/g, product.description);
    output = output.replace(/{ID}/g, product.id);
    output = output.replace(/{FOOD_ICON}/g, product.image);
    
    if(!product.organic) {
        output = output.replace(/{ORGANIC_DISPLAY}/g, 'none');
        output = output.replace(/{ORGANIC_CLASS}/g, 'not-organic');
    } else {
        output = output.replace(/{ORGANIC_DISPLAY}/g, 'block');
        output = output.replace(/{ORGANIC_CLASS}/g, 'organic');
    }
    return output;
}

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);

    //OVERVIEW PAGE
    if(pathname === '/' || pathname === '/Home') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{PRODUCT_CARDS}', cardsHtml);
        
        res.end(output)
    }
    //PRODUCT PAGE
    else if(pathname === '/product') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    }
    //API PAGE
    else if(pathname === '/api'){
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(data);
    }
    // IMAGES
    else if(pathname.startsWith('/image/')) {
         fs.readFile(`${__dirname}${pathname}`, (err, data) => {
             if (err) {
                 res.writeHead(404);
                 res.end('Image not found');
             } else {
                 const extension = pathname.split('.').pop();
                 const mimeType = {
                     'png': 'image/png',
                     'jpg': 'image/jpeg',
                     'jpeg': 'image/jpeg',
                     'svg': 'image/svg+xml',
                     'gif': 'image/gif'
                 }[extension] || 'application/octet-stream';
                 res.writeHead(200, { 'Content-Type': mimeType });
                 res.end(data);
             }
         });
    }
    else {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end("<h1>404 Page Not Found</h1>");
    }
})
 server.listen(3000, "127.0.0.1", () => {
     console.log(`Server started on port 3000`);
 });