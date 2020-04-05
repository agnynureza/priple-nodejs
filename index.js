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
        let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handler.notFound

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
            
        })

        //send response
        res.end('Hello world\n');

        //log the request path 
        console.log('request receive with the headers :' + buffer)
    })
})

server.listen(3000, function(){
    console.log("the server is listening on port 3000")
})

//define the handler
let handlers = {}

//sample handler 
handlers.sample = function(data, callback){
    //callback status code and payload object 
    callback(406,{'name': 'handler sample'})
}

//not found handler
handler.notFound = function(data,callbacl){
    //callback status code and payload not found
    callback(404, {'error': 'routing not found'})
} 


//define a request router 
let router = {
    'sample' : handlers.sample
}