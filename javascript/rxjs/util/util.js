function $(el){
    return document.querySelector(el);
}

function sleep(t){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve(t)
        },t)

        if( Math.random() * 10 < 5){
            reject(99999)
        }
    })
}

function errh(e){
    console.log("[error]", e);
}

function comph(){
    console.log("[complete]");
}