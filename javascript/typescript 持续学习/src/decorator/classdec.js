"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// 普通装饰器
const ShowDecorator = (target, propertyKey, descriptor) => {
    const originData = descriptor.value();
    // console.log('target',target.age);
    descriptor.value = () => {
        return originData + 200;
    };
};
function EnumerableDecorator(value) {
    return function (target, propertyKey, descriptor) {
        descriptor.enumerable = value;
    };
}
// 装饰器工厂实现延时执行装饰器
function SleepDecorator(timer) {
    return (target, propertyKey, descriptor) => {
        const method = descriptor.value;
        descriptor.value = () => {
            setTimeout(() => {
                method();
            }, timer);
        };
    };
}
// 全局的错误处理 ❌
// 切记 切记，这里是重写这个方法
function ErrorHandleDecorator(target, propertyKey, descriptor) {
    const originMethod = descriptor.value;
    descriptor.value = () => {
        try {
            originMethod();
        }
        catch (error) {
            console.log("error :/ ", propertyKey);
        }
    };
}
// 装饰器工厂的方式自定义输出内容
function LogHandleDecorator(title, maxlength = 20) {
    return (target, propertyKey, descriptor) => {
        const originMethod = descriptor.value;
        descriptor.value = () => {
            const day = new Date();
            console.log(`[Log]:${day.toLocaleDateString()}-${(title).slice(0, maxlength)}`);
            originMethod();
        };
    };
}
// 网络请求的工厂函数
function HttpRequestDecorator(url) {
    return (target, propertyKey, descriptor) => {
        const originMethod = descriptor.value;
        descriptor.value = () => {
            const http = require('https');
            http.get(url, (res) => {
                const { statusCode } = res;
                const contentType = res.headers['content-type'];
                originMethod({
                    list: [1, 2, 34]
                });
            });
        };
    };
}
class User {
    constructor() {
        this.name = 'jack';
    }
    // 普通方法参数类型分别是：函数体, 方法名，方法属性描述符号
    show() {
        console.log('====执行了show');
        return 100;
    }
    get age() {
        return 23;
    }
    // 静态方法参数类型分别是：类, 方法名，方法属性描述符号
    static datainfo() {
        return 200;
    }
    request() {
        console.log("this is request!");
        throw new Error("request 408");
    }
    ajax() {
        console.log('ajax', arguments);
    }
}
__decorate([
    SleepDecorator(3000),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], User.prototype, "show", null);
__decorate([
    ErrorHandleDecorator,
    LogHandleDecorator("request"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], User.prototype, "request", null);
__decorate([
    HttpRequestDecorator('https://jsonplaceholder.typicode.com/todos/1'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], User.prototype, "ajax", null);
__decorate([
    ShowDecorator,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], User, "datainfo", null);
const u = new User();
// console.log(u.show());
// for(let key in u) {
//     console.log("keys", key)
// }
u.ajax();
console.log("程序正常执行");
