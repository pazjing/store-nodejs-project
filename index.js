const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(json);

const server = http.createServer((req, res) => {

    const pathName = url.parse(req.url, true).pathname;
    const id = url.parse(req.url, true).query.id;
    
    // Product overview list
    if(pathName === '/products' || pathName === '/') {

        res.writeHead(200, {'Content-type' : 'text/html'});

        fs.readFile(`${__dirname}/templates/template-products.html`, 'utf-8', (err, data) => {
            let productsOutput = data;
            fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => {
                const cardsOutput = laptopData.map(el => replaceTemplate(data, el)).join(''); 
                productsOutput = productsOutput.replace('{%CARD%}', cardsOutput);
                res.end(productsOutput);
            });
        });

    }

    // Laptop detail page
    else if(pathName === '/laptop' && id < laptopData.length) {

        res.writeHead(200, {'Content-type' : 'text/html'});

        fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) => {
            const laptop = laptopData[id];
            const output = replaceTemplate(data, laptop);
            res.end(output);
        });
    }

   // Laptop image 
    else if((/(\.jpg|png|jpeg|gif)$/i).test(pathName)) {
        fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
            res.writeHead(200, {'Content-type' : 'image/jpg'});
            res.end(data);
        });
    }

    // 404 Not found
    else {
        res.writeHead(404, {'Content-type' : 'text/html'});
        res.end('This is the Invalid url.');
    }

});

server.listen(8899, '127.0.0.1', () => {
    console.log('Listerning for the request now.')
});

function replaceTemplate(orignalHtml, laptop) {

    let output = orignalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%ID%}/g, laptop.id);
    return output;
}
