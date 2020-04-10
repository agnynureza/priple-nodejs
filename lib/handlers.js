/*
* Request handlers
*/

//dependencies
const _data = require('../lib/data')

//define the handler
let handlers = {}

//handler users  
handlers.users = function(data, callback){
    //method
    let acceptableMethod = ['get','post','put','delete']
    if(acceptableMethod.indexOf(data.method) != -1){
        handlers._users[data.method](data,callback)
    }else{
       callbacl(405, {'error': 'method not accepted'})
    }
}

//container for handlers users submethod
handlers._users = {}

//users-post
//required data : phone,password,fistname,lastname,tosAgrement 
//optional data : none 
handlers._users.post = function(data,callback){
    //check that all required field are filled out 
    let firstName = typeof(data.payload.firstname) == 'string' && data.payload.firstname.trim().length > 0 ? data.payload.firstname : false 
    let lastName = typeof(data.payload.lastname) == 'string' && data.payload.lastname.trim().length > 0 ? data.payload.lastname : false 
    let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone : false 
    let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password : false 
    let tosAgreement = typeof(data.payload.tosAgreement) == 'string' && data.payload.tosAgreement == true ? true : false 

    if(firstName && lastName && phone && password && tosAgreement){
        //make sure that user doesnt exists
        _data.read('users',phone, function(err,data){
            
        })

    }else{
        callback(400, {'Error': 'Error Missing required parameter'})
    }
}

//pin handler 
handlers.ping = function(data,callback){
    callback(200,{'message': 'server up!'})
}

//not found handler
handlers.notFound = function(data,callback){
    //callback status code and payload not found
    callback(404, {'error': 'routing not found'})
} 


module.exports = handlers