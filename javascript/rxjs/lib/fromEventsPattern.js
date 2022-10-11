// fromEventPattern
// 将添加事件处理器、删除事件处理器的 API 转化为 Observable。
// 理解：适合于在不同的有监听和捕获的地方

class EventEmitter {
  constructor () {
    this.handlers = {}
  }
  on (eventName, handler) {
    if (!this.handlers[eventName]) {
      this.handlers[eventName] = []
    }
	if(typeof handler === 'function') {
		this.handlers[eventName].push(handler)
	} else {
		throw new Error('handler 不是函数！！！')
	}
  }
  off (eventName, handler) {
    this.handlers[eventName].splice(this.handlers[eventName].indexOf(handler), 1)
  }
  emit (eventName, ...args) {
	this.handlers[eventName].forEach(handler => {
      handler(...args)
    })
  }
}

export default ()=>{

    // 原生的事件
    function addClickHandler(handler) {  
      console.log('add click');  
      document.addEventListener('click', handler);
    }
    
    function removeClickHandler(handler) {
      console.log("remove");
      document.removeEventListener('click', handler);
    }
    
    const doc_click$ = rxjs.fromEventPattern(addClickHandler,removeClickHandler)
    const docclick_subscription = doc_click$.subscribe(x => console.log(x));
    setTimeout(()=>{
        // 移除的时候自动会出发off操作
        docclick_subscription.unsubscribe();
    },8000)


    // 自定义的绑定
    const myevent = new EventEmitter();
    let i = 1;

    function readStream(handle){
      myevent.on('read',handle);
    }

    function stopStream(handle){
      myevent.off('read',handle);
    }

    const my_read$ = rxjs.fromEventPattern(readStream,stopStream);
    const my_read_subscription = my_read$.subscribe(x => console.log('@',x));

    setInterval(()=>{
      myevent.emit('read',200,i++);
      if(i >=10 ) {
        my_read_subscription.unsubscribe();
      }
    },500)
}