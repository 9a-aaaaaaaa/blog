// 回调的方式处理读取文件
const http = require('http');
const fs = require('fs');

const server = http.createServer((req,res)=>{
  if(req.url !== '/favicon.ico'){
    fs.readFile('./arcticle.json',(err,jsonDate)=>{
        if(err) errFn(err,res);
        let jsons = JSON.parse(jsonDate);
        fs.readFile('./template.html',(errTem,data)=>{
            if(err) errFn(errTem,res);
            let myShtml = data.toString()
                .replace("{{title}}",jsons.title)
                .replace('{{list.class}}',jsons.list[0]);
              res.writeHead(200,{'Content-Type':'text/html'});
              res.end(myShtml);
        })
    })
  }
});

const errFn = (err,res)=>{
   console.error(err);
   res.end('server error');
};

server.listen('8004',()=>{
   console.log('server is on 8004')
});