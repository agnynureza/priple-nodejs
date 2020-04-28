/*
* helper for various task
*/

//dependencies 
let crypto = require('crypto')
let config = require('./config')
let qs = require('querystring')
let https = require('https')

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
helpers.sendTwilioSms = function (phone,msg,callback){
    //validate parameter 
    phone = typeof(phone) == 'string'? phone : false
    msg = typeof(msg) == 'string' && msg.trim().length > 0 && msg.trim().length ? msg.trim() : false

    if(phone && msg){
        //config request payload 
        let payload = {
            'From' : config.twilio.fromPhone,
            'To' : '+62' + phone,
            'Body': msg
        }
   
        //stringify the payload 
        let stringPayload = qs.stringify(payload)

        //configure the request details 
        let requestDetails = {
            'protocol': 'https:',
            'hostname': 'api.twilio.com',
            'method' : 'POST',
            'path' : '/2010-04-01/Accounts/' + config.twilio.accountSid + '/Messages.json',
            'auth': config.twilio.accountSid+':'+ config.twilio.authToken,
            'headers' : {
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Content-Length' : Buffer.byteLength(stringPayload)
            }
        }

        //instantiate the request object 
        let req = https.request(requestDetails,function(res){
            //grab the send request
            let status = res.statusCode
            //callback successfully if the request went through
            if(status == 200 || status == 201){
                callback(false)
            }else{
                console.log(res.Body)
                callback('Status code returned was ' + status)
            }
        })
        //bind to the error event so it doesnt get thrown 
        req.on('error', function (e){
            callback(e)
        })

        //add the payload 
        req.write(stringPayload)

        //end the request 
        req.end();
    }else{
        callback('Given parameter were missing or invalid');
    }
}


module.exports = helpers