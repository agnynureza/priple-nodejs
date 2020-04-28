/*
create and export configuration variables 
*/

//container for all enviroments
let environment = {}

environment.staging = {
    httpPort : 3000,
    httpsPort : 3001,
    env : 'Staging',
    hashingSecret : 'thisIsSecret',
    maxChecks : 5,
    twilio: {
        'accountSid' : 'ACf77fafdf78e8a03b4810c47710a8bc9e',
        'authToken' : '765e0076e5f39bfc112c642f2cf15b93',
        'fromPhone' : '+19294471524' 
    }
}

environment.production = {
    httpPort : 5000,
    httpsPort : 5001,
    env : 'Production',
    hashingSecret : 'thisIsSecretToo',
    maxChecks : 5,
    twilio: {
        accountSid : '',
        authToken : '',
        fromPhone : '' 
    }
}

//NODE_ENV
let currentEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : 'staging'

//env will be exports
let envExports = typeof(environment[currentEnv]) == 'object' ? environment[currentEnv] : enviroment.staging

//export the module
module.exports = envExports