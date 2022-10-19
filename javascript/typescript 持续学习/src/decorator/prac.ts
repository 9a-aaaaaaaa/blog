// 混合练习 验证参数 
// 参数装饰先执行 比方法装饰器
import 'reflect-metadata';

const IdParameDecor: ParameterDecorator = (target: Object, propertyKey: string | symbol, parameterIndex: number)=>{
    // 记录哪些参数需要验证的
    const requireParams = [];
    requireParams.push(parameterIndex);
    Reflect.defineMetadata('required',requireParams,target,propertyKey);
}


function ValidateDecorator(target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originMethod = descriptor.value;
    const param = Reflect.getMetadata('required',target,propertyKey)||[];
    descriptor.value = ()=>{
       const len = arguments.length;
       param.forEach((index:number) => {
         if( index > len || arguments[index] === undefined) {
            throw new Error("参数不对");
         }
       });
       originMethod();
    }
}

class Login{

    @ValidateDecorator
    find(name: string, @IdParameDecor id: number){

    }
}

new Login().find('aa',1);