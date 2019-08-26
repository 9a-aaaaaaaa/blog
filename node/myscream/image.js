const fs = require('fs');
const http = require('http');
const request = require('request');

const server = http.createServer((req,res)=>{
   // 1

   // fs.readFile('./logo.png','binary',function(err,data){
   //     if(err){
   //        res.end('file not found');
   //     }
   //     else{
   //         res.writeHead(200,{'Content-Type':'image/jpeg'});
   //         res.end(data,'binary');
   //     }
   // })


   // 2
   // fs.createReadStream('./timg.gif').pipe(res);

    // 3
   request
     .get('https://avatar.csdn.net/F/A/A/3_jackson23333.jpg')
     .pipe(res)


});

server.listen(8009);
