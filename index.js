//dependencies 
const fs = require('fs')
const http = require('http')
const https = require('https')
const url = require('url')
const stringDecoder = require('string_decoder').StringDecoder
const config = require('./lib/config')
const _data = require('./lib/data')
const handlers = require('./lib/handlers')
const helpers = require('./lib/helpers')


let serverHttp = http.createServer(function(req,res){
    unifiedServer(req,res)
})

let httpsOptions = {
    key: fs.readFileSync('./https/key.pem'),
    cert: fs.readFileSync('./https/cert.pem')
}

let serverHttps = https.createServer(httpsOptions,function(res,res){
    unifiedServer(req,res)
})

serverHttp.listen(config.httpPort, function(){
    console.log(`the http server is listening on port ${config.httpPort} in ${config.env} now`)
})

serverHttps.listen(config.httpsPort, function(){
    console.log(`the https server is listening on port ${config.httpsPort} in ${config.env} now`)
})

//handler all unified server for http and https server 
let unifiedServer = function(req,res){
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
    let decoder = new stringDecoder('utf-8');
    let buffer = '';
    req.on('data', function(data){
        buffer += decoder.write(data);
    })

    req.on('end', function(){
        buffer += decoder.end()

        //choose handler if route not found go to handler.notfound
        let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound

        //construct data object to send  to the handler 
        let data =  {
            'trimmedPath': trimmedPath,
            'queryStringobject' : queryStringobject,
            'method' : method,
            'headers' : headers,
            'payload' : helpers.parseJsonToObject(buffer)
        }
        //route the request to the handler specified in router
        chosenHandler(data, function(statusCode,payload ){
            //use status code callback from hadnler
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200
            
            //user payload callbal from handler
            payload = typeof(payload) == 'object' ? payload : {}
            console.log(payload)
            //convert payload to string
            let stringify = JSON.stringify(payload)

            res.setHeader('Content-Type','application/json')
            res.writeHead(statusCode)
            res.end(stringify)

            //log the request path 
            console.log('returning this response with : ' + statusCode, stringify)
        })
    })
}

//define a request router 
let router = {
    'users' : handlers.users,
    'ping' : handlers.ping
}