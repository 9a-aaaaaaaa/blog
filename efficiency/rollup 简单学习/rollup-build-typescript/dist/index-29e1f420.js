const log = (message)=>{
    console.log(message);
};

var fetchApi = endpoint =>{
    return fetch(`https://jsonplaceholder.typicode.com/todos/${endpoint}`)
    .then(response => response.json())
    .then(json => console.log(json))
};

export { fetchApi as f, log as l };
