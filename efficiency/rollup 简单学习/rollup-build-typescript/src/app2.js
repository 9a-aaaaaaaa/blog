import { info,log } from "./logger/index";
import fetchApi from './fetch'

fetchApi(2).then( data=>{
    log(data)
})