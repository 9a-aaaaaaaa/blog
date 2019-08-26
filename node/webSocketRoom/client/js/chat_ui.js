const wss = 'http://127.0.0.1:8003/';
const socket = io(wss);
var username = '';


// 工具函数1，2
function divEscapedContentElement(message) {
  return $('<div></div>').text(message);
}

// 2
function divSystemContentElement(message) {
  return $('<div></div>').html('<i>' + message + '</i>');
}

function processUserInput(chatApp, socket) {
  var message = $('#send-message').val();
  var systemMessage;

  if (message.charAt(0) == '/') {
    systemMessage = chatApp.processCommand(message);
    if (systemMessage) {
      $('#messages').append(divSystemContentElement(systemMessage));
    }
  }else {

      // 普通消息
    chatApp.sendMessage($('#room').text(),message);
    $('#messages').append(`<div><span class="names-red">${username}: </span> ${message}</div>`);
    $('#messages').scrollTop($('#messages').prop('scrollHeight'));

  };

    $('#send-message').val('');
}






$(document).ready(function(){

  const chatApp = new Chat(socket);

  // 初始化
  socket.on('initUserName',(data)=>{
     let msg = '';
     if(data.success){
        msg =  `系统为你分配的用户名是【 ${data.nowName} 】,欢迎你登录!`
     }
     $('#messages').append('<p class="username-info">'+msg+'</p>');
  });


  socket.on('username',(nowName)=>{
      username = nowName.nowName;
  });


  // 聊天室列表
  socket.on('rooms',(rlist)=>{
      console.log(rlist)
  });


// 用户列表
  socket.on('userList',(list)=>{
    if(list.success){
      let res = '';
      list.nameUsed.forEach((item)=>{ console.log(item)
        res += `<div class="alink"><a href="javascript:void(0)">${item}</a></div>`;
      });
      $('.list').html(res);
    }
  });


  // 创建聊天室
  socket.on('joinResult', function(result) {
    $('#room').text(result.room);
    $('#messages').append(divSystemContentElement('Room changed.'));
  });


   // 消息监听事件
  socket.on('message', function (message) {
    var newElement = $(`<div><span class="names-green">${message.text}</span></div></div>`);
    $('#messages').append(newElement);
  });



  // 消息处理 preventDefault
  $('#send-form').submit(function(event){
     event.stopPropagation();
     event.preventDefault();
     processUserInput(chatApp, socket);
     return false;
  });

});