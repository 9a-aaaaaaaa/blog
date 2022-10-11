export default ()=>{
    // fromEvent
    const outer = $('.outer');
    const inner = $('.inner');
    // true以后就会变成捕获，自上向下开始执行了
    rxjs.fromEvent(outer,'click').subscribe(x=>console.log("outer"));
    rxjs.fromEvent(inner,'click',).subscribe(x=>console.log("inner"));
    rxjs.fromEvent(document,'click', true).subscribe(x=>console.log("document"));
}