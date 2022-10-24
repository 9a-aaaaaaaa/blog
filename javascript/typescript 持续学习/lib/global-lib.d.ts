/**
 * 全局声明的变量
 * @param options 接入参数内容是什么
 */
declare function globalLib(options: globalLib.Options): void;

/**
 * 声明globalLib 类型
 */
declare namespace globalLib{
   /**
    * 声明版本信息
    */
   const version: string;

   /**
    * 做一些事情的注释
    */
   function doSomething(): void;

   /**
    * 注释信息展示地方
    */
   interface Options {
      [key: string]: any,
   }
}

export default globalLib;