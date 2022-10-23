var name = "rollup-build-typescript";
var version = "1.0.1";

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeJoin = arrayProto.join;

/**
 * Converts all elements in `array` into a string separated by `separator`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to convert.
 * @param {string} [separator=','] The element separator.
 * @returns {string} Returns the joined string.
 * @example
 *
 * _.join(['a', 'b', 'c'], '~');
 * // => 'a~b~c'
 */
function join(array, separator) {
  return array == null ? '' : nativeJoin.call(array, separator);
}

var cjs = {
    name:"yach",
    getVersion: function(){
        return this.name;
    }
};

const skd ={
    name,
    version,
    val: join([1,2,3,4],'@'),
    data: [1],
    getVersion: ()=>{
        const version = cjs.getVersion();
        log("Hello world rollup build",version);
    }
};

// import("./logger").then(({log})=>{
//     log("This is dynamic import infomation!");
// })


// import { info,log } from "./logger/index";
// import fetchApi from './fetch'

// fetchApi(1).then( data=>{
//     log(data)
// })

export { skd as default };
