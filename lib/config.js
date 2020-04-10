/*
create and export configuration variables 
*/

//container for all enviroments
let environment = {}

environment.staging = {
    httpPort : 3000,
    httpsPort : 3001,
    env : 'Staging',
    hashingSecret : 'thisIsSecret'
}

environment.production = {
    httpPort : 5000,
    httpsPort : 5001,
    env : 'Production',
    hashingSecret : 'thisIsSecretToo'
}

//NODE_ENV
let currentEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : 'staging'

//env will be exports
let envExports = typeof(environment[currentEnv]) == 'object' ? environment[currentEnv] : enviroment.staging

//export the module
module.exports = envExports