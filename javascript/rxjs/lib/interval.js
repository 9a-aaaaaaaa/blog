export default ()=>{
    // 案例4 操作符
    // 操作符是用来处理数据流的。我们往往需要对数据流做一系列处理，才交给 Observer
    // 这时一个操作符就像一个管道一样，数据进入管道，完成处理，流出管道
    // interval 每隔 1000 ms 就发出一个从 0 开始递增的数据
    // 操作符不改变原数据，符合函数式编程“数据不可变”的要求
    const source_2_num$ = interval(1000).pipe(map(x=> x * x ));
    const subscription_2 = source_2_num$.subscribe(x=>console.log(x));
    subscription_2.unsubscribe()
}