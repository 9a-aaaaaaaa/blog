import "reflect-metadata";
const data = {
    name: "anikin"
};

Reflect.defineMetadata('set-data',{url:'baidu.com'}, data,'name')
console.log(Reflect.getMetadata('set-data', data, 'name'))