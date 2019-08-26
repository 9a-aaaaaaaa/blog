const http = require('http');
const fs = require('fs');
const util = require('util')
const readAsync = util.promisify(fs.readFile);
const path = require('path');

const getrequrst = async function(req,res){
   let mime = 'text/html';
   let s = '';

   if(req.url == '/'){
        s = await readAsync('./index.html');
        res.writeHead(200, {'Content-type': `${mime};chartset=utf-8`});
       res.end(s);
   }
   else{
     // png mime
     if(req.url !== '/favicon.ico'){

         if(req.url == '/list'){
           console.log('success');
           mime = 'application/json';
           res.writeHead(200, {'Content-type': `${mime};chartset=utf-8`});
           res.end(JSON.stringify({
             status:'success',
             info:['hi','i','am','ok']
           }))
         }

          let ext = path.extname(req.url);
           if(ext.match(/\.(png|jpg)/g)){
             mime = 'image/'+RegExp.$1;
           }
           s = await readAsync('./'+path.basename(req.url.slice(1)));
           res.writeHead(200, {'Content-type': `${mime};chartset=utf-8`});
           res.end(s);
     }
   }
};

http.createServer((req,res)=>{
  res.statusCode = 200;
  getrequrst(req,res);

}).listen(8003,()=>{
  console.log('8003 is running')
})