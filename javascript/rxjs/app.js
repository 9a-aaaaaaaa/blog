const {
    fromEvent,
    take,
    Observable
} = rxjs;
   
// tool
function $(el){
    return document.querySelector(el);
}

// 案例1： 只可以点击1次的按钮
// take(1) 只操作1次，观察者通过订阅subscribe来响应变化
const countBtn = $('.count');
const countBtn$ = fromEvent(countBtn,"click");

countBtn$.pipe(take(1)).subscribe(e=>{
    countBtn.setAttribute('disabled','');
});

// 案例2： 推流
const source$ = new Observable(observer=>{
    observer.next(1);
    observer.next(2);
});

const observer = {
    next(item){
        console.log("value is", item);
    }
};

console.log('start')
source$.subscribe(observer)
console.log('end')














