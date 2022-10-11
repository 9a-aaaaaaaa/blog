const { of, timer, concatMap, fromEvent, interval } = rxjs;

export default () => {
    // ?
    const source = of(1, 2, 3);

    // timer 第二个参数就跟interval一样了
    // timer(1000,2000) 1s后开始传递从0开始的值，然后每2条传递一个 0,1,2,3
    timer(3000)
        .pipe(concatMap(() => source))
        .subscribe(console.log);


    // 创建1-3连续的变化范围
    rxjs.range(1, 3).subscribe({
        next: value => console.log(value),
        complete: () => console.log('Complete!')
    });    


    // defer 只有订阅的时候开始创建数据
    const btn =$('.defer-button');
    let sub = null;
    const clicksOrInterval = rxjs.defer(() => {
        return Math.random() > 0.5
          ? fromEvent(document, 'click')
          : interval(1000);
    });
    fromEvent(btn,'click').subscribe(x=>{
        if (sub) sub.unsubscribe();
        sub = clicksOrInterval.subscribe(x => console.log(x));
    })
}