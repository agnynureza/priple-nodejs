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
            'payload' : buffer
        }

        //route the request to the handler specified in router
        chosenHandler(data, function(statusCode,payload ){
            //use status code callback from hadnler
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200
            
            //user payload callbal from handler
            payload = typeof(payload) == 'object' ? payload : {}

            //convert payload to string
            let stringify = JSON.stringify(payload)

            res.setHeader('Content-Type','application/json')
            res.writeHead(statusCode)
            res.end(stringify)

            //log the request path 
            console.log('returning this response with : ' + statusCode, stringify)
        })
    })
})

server.listen(3000, function(){
    console.log("the server is listening on port 3000")
})

//define the handler
let handlers = {}

//sample handler 
handlers.hello = function(data, callback){
    //callback status code and payload object 
    callback(200,{'message': 'hello world'})
}

//not found handler
handlers.notFound = function(data,callback){
    //callback status code and payload not found
    callback(404, {'error': 'routing not found'})
} 


//define a request router 
let router = {
    'hello' : handlers.hello
}