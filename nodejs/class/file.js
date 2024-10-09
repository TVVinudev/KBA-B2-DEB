const fileSystem = require('fs'); // fs is using for file system manipulation


fileSystem.readFile('example.txt','utf-8',(err,data)=>{  // fs contain file name , standardization , arrow function(error,data).
    if(err) throw err;
    console.log(data);
})