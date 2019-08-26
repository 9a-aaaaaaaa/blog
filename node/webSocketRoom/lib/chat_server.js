const socket_io = require('socket.io');
var   guestNumber = 1;
const nickNames = {};
const nameUsed = [];  // 被占用的用户昵称，防止重复用户名
const currentRoom = {};


exports.listen = function(server){

    const io = socket_io(server);

    io.on('connection',(socket)=>{

        // 1. 在用户连接上来的时候赋给他一个访客名称
      guestNumber = assignGuestName(socket);

        // 2 获取用户名列表
      getUserList(socket);

        // 3 默认创建
      joinRoom(io,socket, '大众聊天室1');

       //  4 接受到普通的消息
      handleMessageBroadcasting(socket);

      //  5 接受修改用户名的
      handleNameChangeAttempts(socket, nickNames, nameUsed);

      socket.on('join',(room)=>{
         let newRoom = room.newRoom;
         joinRoom(io,socket,newRoom)
      });

      socket.on('rooms', function() {
        // socket.emit('roomlist',{usersInRoom})
        socket.emit('rooms', io.sockets.manager.rooms);
      });

    })
};

// 初始化用户昵称
const assignGuestName = (socket)=>{
   let nowName = 'Guest'+ guestNumber;
   // 把用户昵称跟客户端连接的id相关联上

   nickNames[socket.id] = nowName;
   socket.emit('initUserName',{
      success:true,
      nowName
   });

   socket.emit('username',{nowName});
   nameUsed.push(nowName);
   return guestNumber + 1;
};

// 获取用户列表
const getUserList  =(socket)=>{
    socket.emit('userList',{
    success:true,
    nameUsed
  })
};

// 广播消息
const handleMessageBroadcasting = (socket)=>{
    socket.on('message',function(msg){
      socket.broadcast.to(msg.room).emit('message',{
        text: nickNames[socket.id]+ ':' + msg.message,
        time: +new Date()
      })
    })
};


const handleNameChangeAttempts = (socket, nickNames, namesUsed)=>{
  socket.on('nameAttempt', function(name) {

    var previousName = nickNames[socket.id];
    var previousNameIndex = namesUsed.indexOf(previousName);
    namesUsed.push(name);
    nickNames[socket.id] = name;
    delete namesUsed[previousNameIndex];
    socket.emit('nameResult', {
      success: true,
      name: name
    });
    socket.broadcast.to(currentRoom[socket.id]).emit('message', {
      text: previousName + ' is now known as ' + name + '.'
    });

  });

};


// 创建聊天室
const  joinRoom = (io,socket, room) =>{
  socket.join(room);
  currentRoom[socket.id] = room;
  socket.emit('joinResult', {room: room});
  socket.broadcast.to(room).emit('message', {
    text: nickNames[socket.id] + ' has joined ' + room + '.'
  });

  var usersInRoom = io.sockets.adapter.rooms[room]; // 当前的聊天室的信息
  var allRoomInfo  = io.sockets.adapter.rooms; // 所有聊天的信息
  if (usersInRoom.length > 1) {
    var usersInRoomSummary = 'Users currently in ' + room + ': ';

  }

  //socket.emit('message', {text: usersInRoomSummary});
};



