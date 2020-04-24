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

//handlers tokens 
handlers.tokens = function(data,callback){
    //method
    let acceptableMethod = ['get','post','put']
    if(acceptableMethod.indexOf(data.method) != -1){
        handlers._tokens[data.method](data,callback)
    }else{
       callbacl(405, {'error': 'method not accepted'})
    }
}

//container for handlers users submethod
handlers._users = {}

//container for handlers tokens submethod
handlers._tokens = {}


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
    let token = typeof(data.headers.authorization) == 'string' && data.headers.authorization.trim().length == 30 ? data.headers.authorization : false
    if(token){
        handlers._tokens.verifyToken(token, function(err){
            if(!err){
                _data.read('users', phone, function(err,data){
                    if(err){
                        console.log(err)
                        callback(404,{'error': 'data not found'})
                    }else{
                        delete data.password
                        callback(200, {'data': data})
                    }
                })
            }else{
                callback(403, {'Error': 'Invalid token user'})
            }
        })
    }else{
        callback(403,{'Error': 'missing required token'})
    }
}

handlers._users.put = function(data, callback){
    //check that all required field are filled out 
    let firstName = typeof(data.payload.firstname) == 'string' && data.payload.firstname.trim().length > 0 ? data.payload.firstname : undefined
    let lastName = typeof(data.payload.lastname) == 'string' && data.payload.lastname.trim().length > 0 ? data.payload.lastname : undefined
    let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone : false
    let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password : undefined 
    let token = typeof(data.headers.authorization) == 'string' && data.headers.authorization.trim().length == 30 ? data.headers.authorization : false
    
    if (phone && token){
        handlers._tokens.verifyToken(token, function(err){
            if(!err){
                _data.read('users', phone, function(err,data){
                    if(err){
                        callback(400,{'Error': 'users doesnt exists, please create first'})
                    }else{
                        //hash password 
                        let hashedPassword = typeof(password) == undefined ?  helper.hash(password) : data.password;
                        if (hashedPassword){
                            let userObject = {
                                'firstName': typeof(firstName) == undefined ? data.firstName : firstName,
                                'lastName': typeof(lastName) == undefined ? data.lastName : lastName,
                                'password': hashedPassword ,
                                'phone': phone,
                                'tosAgreement': true
                               }
                       
                            _data.update('users', phone, userObject, function(err){
                                if(!err){
                                    callback(200 ,{'message': 'OK'})
                                }else{
                                    console.log(err)
                                    callback(500,{'error' : 'Could not update the user\'s'})
                                }
                            })
                        }else{
                            callback(500, {'error': 'Cannot hashed user\'s password'})
                        } 
                    }
                })
            }else{
                callback(403, {'Error': 'Invalid token'})
            }
        })
    }else{
        callback(400, {'error': 'Error missing requires parameters'})
    }
}


handlers._users.delete = function(data,callback){
    let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone : false
    let token = typeof(data.headers.authorization) == 'string' && data.headers.authorization.trim().length == 30 ? data.headers.authorization : false

    if(phone && token){
        handlers._tokens.verifyToken(token, function(err){
            if(!err){
                _data.read('users', phone,function (err, data){
                    if(!err && data){
                        _data.delete('users', phone, function(err){
                            if(!err){
                                callback(200 ,{'message': 'OK'})
                            }else{
                                callback(500, {'error': 'fail delete user\'s data'})
                            }
                        })
                    }else{
                        callback(400, {'error': 'user doesn\'t exists'})
                    }
                })
            }else{
                callback(403, {'Error': 'Invalid token'})
            }
        })
    }else{
        callback(400, {'error': 'missing required parameter'})
    }
}

//create token
handlers._tokens.post = function(data,callback){
    let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone : false 
    let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password : false 
    if(phone){
        _data.read('users', phone, function(err, data){
            if(!err && data){
                //hash password 
                let hashedPassword = helper.hash(password)
                if (hashedPassword){
                    if(hashedPassword == data.password){
                        let tokenId  = helper.createRandomString(30)
                        let expired = Date.now() + 1000 * 60 * 120 //2hour
                        let tokenObject = {
                            id : tokenId,
                            phone : data.phone,
                            expired : expired
                        }
                        _data.create('tokens', tokenId, tokenObject, function(err){
                            if(!err){
                                callback(200, tokenObject)
                            }else{
                                console.log(err)
                                callback(500, {'Error': `fail create token for user ${data.phone}`})
                            }
                        })
                    }else{
                        callback(400 , {'Error': 'invalid user password'})
                    }
                }else{
                    callback(500, {'Error': 'cannot hashed user\'s password'})
                }
            }else{
                 callback(400, {'Error': 'user doesn\'t exists'})
            }
        })
    }else{
        callback(400,{'Error': 'missing requires parameter or invalid password'})
    }
}

//check token
handlers._tokens.verifyToken = function(data,callback){
    let token = typeof(data) == 'string' && data.length == 30 ? data : false 
    _data.read('tokens', token, function(err, data){
        if(!err && data){
            callback(false)
        }else{
            callback(true)
        }
    })
}

//handlers checks 
handlers.checks = function(data,callback){
    //method
    let acceptableMethod = ['get','post','put']
    if(acceptableMethod.indexOf(data.method) != -1){
        handlers._checks[data.method](data,callback)
    }else{
       callbacl(405, {'error': 'method not accepted'})
    }
}


//container for all checks method 
handlers._checks = {}


//check - Post
//required data: protocol , url, sucessCodes, timeoutSecond
//optional data : none 

handlers._checks.post =  function(data,callback){
    //validate input 
    let protocol = typeof(data.payload.protocol) == 'string' && ['http','https'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false
    let url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false
    let method = typeof(data.payload.method) == 'string' && ['post','get','delete','put'].indexOf(data.payload.method) > -1 ? data.payload.method : false
    let sucessCodes  = typeof(data.payload.sucessCodes) == 'object' && data.payload.sucessCodes instanceof Array && data.payload.sucessCodes.length > 0? data.payload.sucessCodes : false
    let timeoutSecond = typeof(data.payload.timeoutSecond) == 'number' && data.payload.url.timeoutSecond%1 == 0 && data.payload.timeoutSecond >= 1 && data.payload.timeoutSecond <= 5 ? data.payload.timeoutSecond : false

    if(protocol && url && method && sucessCodes && timeoutSecond){
        //get token from the headers 
        let token = typeof(data.headers.token) == 'string' ? data.headers.token : false

        //lookup user with token read token
        _data.read('tokens', token, function(err,tokenData){
            if(!err && tokenData){
                let userPhone = tokenData.phone

                //lookup the user data 
                _data.read('users', userPhone, function(err,userData){
                   if(!err && userData){
                    let userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
                    //verify that user has less the number 0 max check per user 
                    if(userChecks.length < config.maxChecks){
                        //create random id for check 
                        let checkId = helper.createRandomString(20);

                        //create the check object  and include the user phone
                        let checkObject = {
                            'id': checkId,
                            'userPhone': userPhone,
                            'protocol': protocol,
                            'url' : url,
                            'method' : method,
                            'sucessCodes' : sucessCodes,
                            'timeoutSeconds' : timeoutSecond
                        }
                        _data.create('checks', checkId, checkObject, function(err){
                            if(!err){
                                //add check id to user object 
                                userData.checks = userChecks
                                userData.check.push(checkId)

                                //save to new user data 
                                _data.update('users',userPhone, userData, function(err){
                                    if(!err){
                                        callback(200, checkObject)
                                    }else{
                                        callback(500,{"Error": "could not update the new user with the new check"})
                                    }
                                })
                            }else{
                                callback(500,{"Error": "could not create the new check"})
                            }
                        })
                    }else{
                        callback(400,{"Error": `the user already has the maximum number if checks ${config.maxChecks}`})
                    }
                   }else{
                       callbacl(403, {"Error": "unauthorized"})
                   }
                })
            }else{
                callback(403, {"Error": "unauthorized"})
            };
        });
    }else{
        callback(400,{"Error": "missing required input, or input invalid"})
    }
}

//ping handler 
handlers.ping = function(data,callback){
    callback(200,{'message': 'server up!'})
}

//not found handler
handlers.notFound = function(data,callback){
    //callback status code and payload not found
    callback(404, {'error': 'routing not found'})
} 


module.exports = handlers