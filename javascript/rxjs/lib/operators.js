const { 
    of, 
    from, 
    filter, 
    map,
    mapTo,
    scan, 
    concatMap, 
    fromEvent, 
    interval,
    take,
    takeUntil,
    first,
    merge,
    concat,
    mergeAll 
} = rxjs;

// scan 则是和 reduce 方法类似，每个的运算规则是跟上一次的计算结果一起
// mapTo 是将所有发出的数据映射到一个给定的值。

// 【一些过滤的操作符】
// take 是从数据流中选取最先发出的若干数据
// takeLast 是从数据流中选取最后发出的若干数据
// takeUntil 是从数据流中选取直到发生某种情况前发出的若干数据
// first 是获得满足判断条件的第一个数据
// last 是获得满足判断条件的最后一个数据
// skip 是从数据流中忽略最先发出的若干数据
// skipLast 是从数据流中忽略最后发出的若干数据


// 合并类操作符
// concat、merge 都是用来把多个 Observable 合并成一个
// concat 要等上一个 Observable 对象 complete 之后才会去订阅第二个 Observable 对象获取数据并把数据传给下游
// merge 时同时处理多个 Observable。使用方式如下：

// race、zip 

export default ()=>{

    // takeUtilHandle();
    // firstClickDiv();
    // mergeHandle();
    // concateHndle();
    hocHandle();

    // const higherOrder = fromEvent(document, 'click').pipe(
    //     map((ev) => interval(1000).pipe(take(5))),
    //   );
    //   // 并发2
    //   const firstOrder = higherOrder.pipe(mergeAll(2));
    //   firstOrder.subscribe(x => console.log('called--', x))
    
}

function arrayLikeHnadle(){
    from([1,2,3,4,5,6]).pipe(
        scan((total,n)=> total + n), // 1 3 6 10 15 21
        map(x => x * 2),
        filter(x => x % 2 === 0),
        take(3), // take(3)，表示只取 3 个数据，
        mapTo(100)
    ).subscribe(x=>console.log("x", x));
}

// HOC嵌套方式执行
function hocHandle(){
    // 每次点击完了开启一个5内的计数器
    const higherOrder = fromEvent(document, 'click').pipe(
        map((ev) => interval(1000).pipe(take(5))),
    );
    higherOrder.subscribe(x => {
        console.log("==clickede", x);
        x.subscribe(a=> console.log(a))
    });
}

// concat 安装顺序以此执行
function concateHndle(){
    const timer1 = interval(1000).pipe(take(3));
    const timer2 = interval(1000).pipe(take(5));
    concat(timer1,timer2).subscribe(x => console.log(x));
}

function mergeHandle(){
    const clicks = fromEvent(document, 'click');
    const timer = interval(1000);
    const clicksOrTimer = concat(clicks, timer);
    clicksOrTimer.subscribe(x => console.log(x));
}

function mergeHandle2(){
     // 第二个参数是控制同时运行几个
    // 实现一个队列的操作
    const timer1 = interval(1000).pipe(take(10));
    const timer2 = interval(2000).pipe(take(6));
    const timer3 = interval(500).pipe(take(10));
    const concurrent = 2; // the argument
    const merged = merge(timer1, timer2, timer3, concurrent);
    merged.subscribe(x => console.log(x),(e)=>console.log('err',e),(x)=>console.log('complete',x));
}


function takeUtilHandle(){
    const mouseOverRx = fromEvent($('.defer-button'),'mouseover');
    const result = interval(1000).pipe(takeUntil(mouseOverRx));
    result.subscribe(x=>console.log('hover', x));
}

function firstClickDiv(){
    const div = document.createElement('div');
    div.style.cssText = 'width: 200px; height: 200px; background: #09c;';
    document.body.appendChild(div);

    const clicks = fromEvent(document, 'click');
    const result = clicks.pipe(first(ev => ev.target.tagName === 'DIV'));
    result.subscribe(x => console.log(x));
}