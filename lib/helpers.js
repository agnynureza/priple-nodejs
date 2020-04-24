/*
* helper for various task
*/

//dependencies 
let crypto = require('crypto')
let config = require('./config')

//container for all helpers
let helpers = {}

//create sha256 hash
helpers.hash = function (str){
    if(typeof(str) == 'string' && str.length > 0){
        let hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex')
        return hash
    }
    return false
}

//parse string to json , without throwing 
helpers.parseJsonToObject = function(str){
    try{
        let obj = JSON.parse(str)
        return obj;
    }catch(e){
        return {};
    }
}

helpers.createRandomString = function(str){
    let token = ''
    let possibleToken = 'abcdefghijklmnopqrstuvwxyz0123456789'
    for(let i = 1 ; i <= str ; i++){
        let rand = possibleToken[Math.floor(Math.random() * str)]
        token += rand
    }
    return token
}



module.exports = helpers