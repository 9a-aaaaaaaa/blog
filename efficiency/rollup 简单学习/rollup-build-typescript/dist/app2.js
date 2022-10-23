const log = (message)=>{
    console.log(message);
};

var fetchApi = endpoint =>{
    return fetch(`https://jsonplaceholder.typicode.com/todos/${endpoint}`)
    .then(response => response.json())
    .then(json => console.log(json))
};

fetchApi(2).then( data=>{
    log(data);
});
