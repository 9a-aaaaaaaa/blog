import * as lib from './lib/index.js';
const {
    fromEvent,
    take,
    map,
    interval,
    Subject,
    AsyncSubject
} = rxjs;

// 案例1： 只可以点击1次的按钮
// take(1) 只操作1次，观察者通过订阅subscribe来响应变化
const countBtn = $('.count');
const countBtn$ = fromEvent(countBtn,"click");
countBtn$.pipe(take(1)).subscribe(e=>{
    countBtn.setAttribute('disabled','');
});


const subject = new AsyncSubject()
subject.subscribe(x=>console.log('Observer A: ' + x))
subject.next(1)
subject.next(2)
subject.next(3)
subject.complete()
// Observer A: 3
setTimeout(() => {
  subject.subscribe(x=> console.log('Observer B: ' + x))
  // Observer B: 3
}, 500)
  
  


// 案例5：创建Oservable
// of v8即将废弃
// rxjs.of(1,3,5,7).subscribe(x=>console.log("==>",x));

// lib.froms();
// lib.fromEvent();
// lib.fromEventsPattern()
// lib.timer();
lib.operators();







