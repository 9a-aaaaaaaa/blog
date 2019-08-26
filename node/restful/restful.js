const http = require('http');
const url = require('url');
const chunkData = [];
const  fs = require('fs');

http.createServer((req,res)=>{
     let type = req.method;
     req.setEncoding('utf8');
     switch (type){
       case 'POST':

         let gets = '';
         req.on('data',(chunck)=>{
            gets +=chunck;
         });
         req.on('end',()=>{

           res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});
           chunkData.push(gets);
           res.end(chunkData.toString());
         });
       break;

       case 'GET':

         let bod = chunkData.map((item,ind)=>{
            return(`${ind} ): ${item}\n`);
         }).join('\n');
         res.setHeader('Content-Type','text/plain; charset="utf-8" ');
         res.setHeader('Content-Length',Buffer.byteLength(bod));
         res.end(bod);
         break;

       case 'DELETE':
         let basename = url.parse(req.url).pathname;
         let d_id = parseInt(basename.slice(1),10);
         if(isNaN(d_id)) {
            res.statusCode = 400;
            res.end('invalid item id');
         }
         else if (!chunkData[d_id]){
            res.statusCode = 404;
            res.end('not found id');
         }
         else{
            chunkData.splice(d_id,1);
            res.end('ok\n');
         }
         break;

       case 'PUT':
         console.log(url.parse(req.url))
         let pathN = url.parse(req.url).pathname;
         let pid = parseInt(pathN.slice(1),10); console.log(pid);
         let pcon = '';
         req.on('data',(pchunk)=>{
           pcon+=pchunk;
         });
         req.on('end',()=>{ console.log(pcon);
           chunkData.splice(pid,1,pcon);
           res.end('ok\n');
         });
       default:
         res.end('error\n');
     }
}).listen('8081',()=>{
     console.log('server is run 8081')
});