//dependencies 
const http = require('http')
const url = require('url')
const stringDecoder = require('string_decoder').StringDecoder

let server = http.createServer(function(req,res){
    //get the url and parse it
    let parsedUrl = url.parse(req.url, true);

    //get the path 
    let path = parsedUrl.pathname
    let trimmedPath = path.replace(/^\/+|\/+$/g,'');

    //get the query string as an object 
    let queryStringobject = parsedUrl.query;

    //http method 
    let method = req.method.toLocaleLowerCase();

    //get the headers as an object 
    let headers = req.headers;

    //get the payload 
    let decoder = new stringDecoder('utf-8')

    //send response
    res.end('Hello world\n');

    //log the request path 
    //console.log('Request received on path : ' + trimmedPath + ' with method ' + method + 'with these query string parameters ' , queryStringobject);
    console.log('request receive with the headers :' + headers)
})

server.listen(3000, function(){
    console.log("the server is listening on port 3000")
})