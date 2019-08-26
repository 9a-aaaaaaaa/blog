const http = require('http');
const url = require('url');
const chunkData = [];
const  fs = require('fs');

http.createServer((req,res)=>{ console.log(req.method);
     let type = req.method;
     // post 请求后是buffer格式，这里设定格式，后续就不用在toString()
     req.setEncoding('utf8');
     switch (type){
       case 'POST':
       var authorization = req.headers.authorization; console.log(authorization);
       var parts = authorization.split(' ');
       var scheme = parts[0];
       var auth = new Buffer(parts[1], 'base64').toString().split(':');
       var user = auth[0];
       var pass = auth[1];
      
       if(user === 'qiuyanlong'){ 
         let gets = '';
         req.on('data',(chunck)=>{
           gets +=chunck;
         });
         req.on('end',()=>{
           res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});
           chunkData.push(gets);

           // res.end() 返回的必须是一个字符串
           res.end(JSON.stringify({
             status:'ok'
           }));
         });
       }
       else
       {
       
         // 关闭弹窗信息，一般是用户首先进来以后就需要认证弹窗
        // res.writeHead(401,{
        //   'content-Type':'text/plain',
        //   'WWW-Authenticate':'Basic realm="family"'
        // });
      
         res.end('opps, 401 you need right username and password')
       }
       break;

       case 'GET':
         fs.createReadStream('./index.html').pipe(res);
         break;

       default:
         res.end('error\n');
     }
}).listen('8081',()=>{
     console.log('server is run 8081')
});