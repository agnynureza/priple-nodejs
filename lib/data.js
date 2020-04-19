/*
library for storing and editing data 
*/

//dependecies
let fs = require('fs')
let path = require('path')
let helpers = require('./helpers')

//container for the module
let lib = {}

//base directory on data folder 
lib.baseDir = path.join(__dirname,'../.data')

//wx for writing file
//create file or data 
lib.create = function(dir,file,data,callback){
    //open the file for writing
    fs.open(`${lib.baseDir}/${dir}/${file}.json`,'wx', function(err,fileDescriptor){
        if(!err && fileDescriptor){
            //convert data to the string 
            let stringData = JSON.stringify(data)

            //write file and close it
            fs.writeFile(fileDescriptor, stringData, function(err){
                if(!err){
                    fs.close(fileDescriptor, function(err){
                        if(!err){
                            callback(false)
                        }else{
                            callback('error closing new file')
                        }
                    })
                }else{
                    callback('error write new file')
                }
            });
        }else{
            callback('Could not create new file, it may already exists !')
        }
    });
}

//Read data from file
lib.read =  function(dir,file,callback){
    //read file
    fs.readFile(`${lib.baseDir}/${dir}/${file}.json`,'utf-8',function(err,data){
        if(!err && data){
            let parsedData = helpers.parseJsonToObject(data)
            callback(false,parsedData)
        }else{
            callback(err,data)
        }
    }) 
}

//Update data to file
//r+ for write  
lib.update = function (dir,file,data,callback){
    //open file first 
    fs.open(`${lib.baseDir}/${dir}/${file}.json`,'r+',function(err,fileDescriptor){
        if(!err && fileDescriptor){
            let stringData = JSON.stringify(data)
            
            //truncate
            fs.truncate(fileDescriptor,function(err){
                if(!err){
                    fs.writeFile(fileDescriptor,stringData, function(err){
                        if(!err){
                            fs.close(fileDescriptor, function(err){
                                if(!err){
                                    callback(false)
                                }else{
                                    callback('Error close file')
                                }
                            })
                        }else{
                            callback('Error writing file')
                        }
                    })
                }else{
                    callback('Error cannot truncate file')
                }
            })
        }else{
            callback('could not open file, it may file not exists!')
        }    
    })
}

//Delete file 

lib.delete = function(dir,file,callback){
    fs.unlink(`${lib.baseDir}/${dir}/${file}.json`,function(err){
        if(!err){
            callback(false)
       } else{
           callback('Error delete file')
       }
    })
}

module.exports = lib