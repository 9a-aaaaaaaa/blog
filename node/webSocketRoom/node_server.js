const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime');

// 缓存对象，用于缓存上次上文过的文件，减小i/o 开销的操作
const catchPath = {};


const server = http.createServer( (req,res)=>{

  let staticPath,
      absPath;

  if(req.url !== 'favicon.ico'){

    // 配合nginx 的负载均衡，根路由发生变化
    if( req.url == '/'){
        staticPath = 'index.html'
    }
    else{
      staticPath = 'client/'+ req.url;
    }

    absPath = './'+ staticPath;
    serverStatic(res,absPath,catchPath);
  }


});


// 构建的404
const page_404 = (res) =>{
   res.writeHead(404,{'Content-Type':'text/plain'});
   res.write('404 page: sorry this is 404');
   res.end();
};


//
const sendFile = (res,filepath,rescontent)=>{
   res.writeHead(
     200,
     {
       'Content-Type': mime.getType(path.basename(filepath))
     }
   );
   res.end(rescontent);
};


const serverStatic = (res,staticPath,catchPath)=>{

  if(catchPath[staticPath]){
     sendFile(res,staticPath,catchPath[staticPath]);
  }else{
    console.log('!'+staticPath)

    // 检查当前目录中是否存在该文件，以及该文件是否可写。
    fs.access(staticPath, fs.constants.F_OK | fs.constants.W_OK, (err) => {
      if (err) {
        let {code} = err;
        if(code == 'ENOENT'){
           page_404(res);
        }

      } else {
        fs.readFile(staticPath,(err,data)=>{
          if(err){
              page_404(res);
          }
          catchPath[staticPath] = data;
          sendFile(res,staticPath,data);
        });
      }
    });
  }
};

server.listen(8005,function(){
  console.log('server is listening 8005')
});


const chatServer = require('./lib/chat_server');
chatServer.listen(server);























