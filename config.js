/*
create and export configuration variables 
*/

//container for all enviroments
let environment = {}

environment.staging = {
    port : 3000,
    env : 'Staging'
}

environment.production = {
    port : 5000,
    env : 'Production'
}

//NODE_ENV
let currentEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : 'staging'

//env will be exports
let envExports = typeof(environment[currentEnv]) == 'object' ? environment[currentEnv] : enviroment.staging

//export the module
module.exports = envExports