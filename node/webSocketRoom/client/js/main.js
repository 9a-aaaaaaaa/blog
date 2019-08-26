
class Chat {

   constructor(socket){
      this.socket = socket;
   }

   async sendMessage(room,message){
        await this.socket.emit('message',{room,message});
   }

   changeRoom(newRoom){
       this.socket.emit('join',{newRoom});
   }

   processCommand(command){

     var comm = /\/nick\s*(.+)|\/join\s*(.+)/gi.test(command);

     var message = false;

     var content = RegExp.$1 || RegExp.$2;

     var words = command.split(' ');
     var command = words[0]
       .substring(1, words[0].length)
       .toLowerCase();

     switch(command) {
       case 'join':
         this.changeRoom(content);
         break;
       case 'nick':
         this.socket.emit('nameAttempt', content);
         break;
       default:
         message = '您输入的命令不存在，请检查输入的命令';
         break;
     };

     return message;
   }

}

