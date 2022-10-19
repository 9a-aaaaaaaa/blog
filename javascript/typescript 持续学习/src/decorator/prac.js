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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
// 混合练习 验证参数 
// 参数装饰先执行 比方法装饰器
require("reflect-metadata");
const IdParameDecor = (target, propertyKey, parameterIndex) => {
    // 记录哪些参数需要验证的
    const requireParams = [];
    requireParams.push(parameterIndex);
    Reflect.defineMetadata('required', requireParams, target, propertyKey);
};
function ValidateDecorator(target, propertyKey, descriptor) {
    const originMethod = descriptor.value;
    const param = Reflect.getMetadata('required', target, propertyKey) || [];
    descriptor.value = () => {
        const len = arguments.length;
        param.forEach((index) => {
            if (index > len || arguments[index] === undefined) {
                throw new Error("参数不对");
            }
        });
        originMethod();
    };
}
class Login {
    find(name, id) {
    }
}
__decorate([
    ValidateDecorator,
    __param(1, IdParameDecor),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], Login.prototype, "find", null);
new Login().find('aa', 1);
