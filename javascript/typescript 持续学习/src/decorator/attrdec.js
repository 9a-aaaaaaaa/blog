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
// 属性装饰器
// target 同方法装饰器 分为静态和普通的
const VersionPropsDecorator = (target, propertyKey) => {
    console.log(target, propertyKey);
};
// parameterIndex 参数在入参数组中的位置
const InitParameDecor = (target, propertyKey, parameterIndex) => {
    //console.log(target, propertyKey,parameterIndex);
};
// 转换属性的值保持为小写
function LowerDecorator(target, propertyKey) {
    let value;
    Object.defineProperty(target, propertyKey, {
        get: () => {
            return value.toLocaleLowerCase();
        },
        set: v => {
            value = v;
        }
    });
}
class Sdk {
    init(id = 1, initdata) {
        console.log('ini--');
    }
}
__decorate([
    VersionPropsDecorator,
    LowerDecorator,
    __metadata("design:type", Object)
], Sdk.prototype, "version", void 0);
__decorate([
    __param(1, InitParameDecor),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], Sdk.prototype, "init", null);
const s1 = new Sdk();
s1.version = "faASDAAS";
console.log(s1.version);
