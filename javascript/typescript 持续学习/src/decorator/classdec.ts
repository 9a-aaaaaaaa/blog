// 普通装饰器
const ShowDecorator:MethodDecorator = (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) =>{
    const originData = descriptor.value();
    // console.log('target',target.age);
    descriptor.value = ()=>{
        return originData + 200;
   }
}


function EnumerableDecorator(value: boolean) {
    return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.enumerable = value;
    }
}


// 装饰器工厂实现延时执行装饰器
function SleepDecorator(timer: number) {
    return (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor)=>{
        const method = descriptor.value;
        descriptor.value = ()=>{
            setTimeout(() => {
                method();
            }, timer);
        }
    }
}


// 全局的错误处理 ❌
// 切记 切记，这里是重写这个方法
function ErrorHandleDecorator(target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) 
{
    const originMethod = descriptor.value;
    descriptor.value = ()=>{
        try {
            originMethod()
        } catch (error) {
            console.log("error :/ ", propertyKey); 
        }
    }
}

// 装饰器工厂的方式自定义输出内容
function LogHandleDecorator(title:string, maxlength:number = 20) {
    return (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
        const originMethod = descriptor.value;
        descriptor.value = ()=>{
            const day = new Date();
            console.log(`[Log]:${day.toLocaleDateString()}-${(title).slice(0,maxlength)}`);
            originMethod()
        }
    }
}

// 网络请求的工厂函数
function HttpRequestDecorator(url: string) {
    return (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
        const originMethod = descriptor.value;
        descriptor.value = ()=>{
            const http = require('https');
            http.get(url,(res:any)=>{
                const { statusCode } = res;
                const contentType = res.headers['content-type'];
                originMethod({
                    list:[1,2,34]
                })
            })
            
        }
    }
} 

class User{

    name='jack';

    // 普通方法参数类型分别是：函数体, 方法名，方法属性描述符号
    @SleepDecorator(3000)
    // @ShowDecorator
    // @EnumerableDecorator(true)
    public show() {
        console.log('====执行了show');
        return 100
    }

    get age(){
        return 23;
    }

    // 静态方法参数类型分别是：类, 方法名，方法属性描述符号
    @ShowDecorator
    static datainfo(){
        return 200
    }

    @ErrorHandleDecorator
    @LogHandleDecorator("request")
    public request(){
        console.log("this is request!");
        throw new Error("request 408");
    }


    @HttpRequestDecorator('https://jsonplaceholder.typicode.com/todos/1')
    public ajax(){
        console.log('ajax', arguments);
    }
}

const u = new User();
// console.log(u.show());

// for(let key in u) {
//     console.log("keys", key)
// }

u.ajax();
console.log("程序正常执行");