// 回调的方式处理读取文件
const http = require('http');
const fs = require('fs');
const util = require('util')
const readAsync = util.promisify(fs.readFile);


async function init () {
  let jsons = await readAsync('./arcticle.json');
  let myShtml = await readAsync('./template.html');
      jsonData = JSON.parse(jsons);

  let myShtmlContent = myShtml.toString()
      .replace("{{title}}",jsonData.title)
      .replace('{{list.class}}',jsonData.list[0]);

  return myShtmlContent;
};

const server = http.createServer((req,res)=>{
  if(req.url !== '/favicon.ico'){
    init().then((s)=>{
      res.writeHead(200,{'Content-Type':'text/html'});
      res.end(s);
    }).catch((err)=>{
       errFn(err,res);
    })

  }
});

const errFn = (err,res)=>{
  console.error(err);
  res.end('server error');
};

server.listen('8005',()=>{
  console.log('server is on 8005')
});