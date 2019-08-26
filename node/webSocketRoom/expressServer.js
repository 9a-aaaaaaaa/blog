const express = require('express');
const app = express();

const http  = require('http').createServer(app);
const io = require('socket.io')(http);

const catchContent = {};


// 静态资源服务器路径
app.use(express.static('client'));

app.get('/', (req,res)=>{
  res.sendFile(__dirname +'/index_express.html');
});


io.on('connection',function(socket){

  socket.broadcast.emit('broadcast', '欢迎新朋友的到来~');

  // 新进来的欢迎词

  io.emit('welcome','欢迎你进入我们的房间');

  // 消息
  socket.on('chat message',function(msg){
     let mesgreg = /nick\:(.+)/gi;

      // 修改用户名
     if(mesgreg.test(msg)){
        io.emit('changname',RegExp.$1);
        catchContent['list'].push(RegExp.$1)
     }

     else{
       io.emit('chat message',msg);
     }
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

});


//
http.listen(3000, function(){
  console.log('listening on *:3000');
});

