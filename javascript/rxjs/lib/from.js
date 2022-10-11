const { map } = rxjs;
export default ()=>{
    // from 将可遍历的对象（iterable）转化为一个 Observable

    // 方便数组的加工
    // rxjs.from([11,13,15,17]).subscribe(x=>console.log("==>",x));
    rxjs.from([11,13,15,17]).pipe(map(x=>x*10)).subscribe(x=>console.log("=",x))

    rxjs.from('anikin').subscribe(x=>console.log("==>",x));

    
    rxjs.from(sleep(2)).subscribe(x=>console.log("==>",x),errh,comph);
}
