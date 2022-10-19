// 属性装饰器
// target 同方法装饰器 分为静态和普通的
const  VersionPropsDecorator: PropertyDecorator = (target: Object, propertyKey: string | symbol)=>{
    console.log(target, propertyKey);
}

// parameterIndex 参数在入参数组中的位置
const InitParameDecor: ParameterDecorator = (target: Object, propertyKey: string | symbol, parameterIndex: number)=>{
    //console.log(target, propertyKey,parameterIndex);
}


// 转换属性的值保持为小写
function LowerDecorator(target: Object, propertyKey: string | symbol) {
   let value:string;
   Object.defineProperty(target,propertyKey,{
     get:()=>{
        return value.toLocaleLowerCase();
     },
     set: v=>{
        value = v;
     }
   })
}

class Sdk{
    @VersionPropsDecorator
    @LowerDecorator
    public version: string | undefined

    public init(id: number=1,@InitParameDecor initdata: string){
        console.log('ini--');
    }
}


const s1 = new Sdk();
s1.version = "faASDAAS";
console.log(s1.version);
