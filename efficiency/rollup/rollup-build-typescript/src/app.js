
import { name,version  } from "../package.json";
import { join } from 'lodash-es';
import yach from './cjs';
import fetchApi from './fetch'
import { log } from "./logger"


const skd ={
    name,
    version,
    val: join([1,2,3,4,5],'@'),
    data: [1],
    getVersion: ()=>{
        console.log("哈哈哈");
        const version = yach.getVersion();
        log("Hello world rollup build",version);
        if(process.env.NODE_ENV === 'production') {
            log(99999)
        }
        else {
            log(8888)
        }
    },
    request: async ()=>{
        const getData = await fetchApi(1);
        return getData;
    }
}
export default skd;

// import("./logger").then(({log})=>{
//     log("This is dynamic import infomation!");
// })


// import { info,log } from "./logger/index";

// fetchApi(1).then( data=>{
//     log(data)
// })