export default () => {
    // 案例2：Observable Stream 被观察者 
    // 推流同步事件源和异步事件源
    // 同步
    const source_sync$ = new rxjs.Observable(observer => {
        observer.next(1);
        observer.next(2);
    });
    // 异步
    const source_async$ = new rxjs.Observable(observer => {
        let number = 1;
        setInterval(() => {
            observer.next(number++);
        }, 2000);
    });

    console.log('start')
    source_async$.subscribe(observer)
    console.log('end')


    // 案例3：观察者
    const source_sync_2$ = new Observable(observer => {
        observer.next(1);
        observer.complete(); // 结束推流
        observer.next(3);
    });
    // 也可以不单独构建对象，在subscribe函数里面单独实现
    const observer_2 = {
        next(item) {
            console.log("value is", item);
        },
        complete: () => console.log("complete"),
        error(e) {
            console.log("[err] has error", e);
        }
    };

    const subscription = source_sync_2$.subscribe(observer_2);
    subscription.unsubscribe();
}