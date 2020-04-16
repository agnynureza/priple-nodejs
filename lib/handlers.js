/*
* Request handlers
*/

//dependencies
const _data = require('../lib/data')
const helper = require('./helpers')

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
    let tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false 
    
    if(firstName && lastName && phone && password && tosAgreement){
        //make sure that user doesnt exists
        _data.read('users',phone, function(err,data){
            if(err){
                //hash the password 
                let hashedPassword = helper.hash(password)

                if(hashedPassword){
                    let userObject = {
                        'firstName': firstName,
                        'lastName': lastName,
                        'password': hashedPassword,
                        'phone': phone,
                        'tosAgreement': true
                    }
    
                    _data.create('users', phone, userObject, function(err){
                        if(!err){
                            callback(200 ,{'message': 'OK'})
                        }else{
                            console.log(err)
                            callback(500,{'error' : 'Could not create the new user'})
                        }
                    })
                }else{
                    callback(500,{'error': 'Could not hashed user\'s password '})
                }
            }else{
                callback(400, {'error': 'Error user already exists !'})
            }
        })

    }else{
        callback(400, {'Error': 'Error Missing required parameter'})
    }
}

handlers._users.get = function(data, callback){
    let phone = typeof(data.queryStringobject.phone) == 'string' && data.queryStringobject.phone.trim().length == 10 ? data.queryStringobject.phone : false 
    _data.read('users', phone, function(err,data){
        if(err){
            console.log(err)
            callback(404,{'error': 'data not found'})
        }else{
            let dataParse = JSON.parse(data)
            callback(200, {'data': dataParse})
        }
    })
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