console.log("Hello main.js");

const searchNode = document.querySelector("div input#search-box");

searchNode.addEventListener("input" , (event) => {
    //Call fetch api ? 

    fetch("http://localhost:5600/data" , {
        headers : {
            'Access-Control-Allow-Origin': '*'
        }
    })
    .then(res => res.json())
    .then((finalRes) => {
        console.log(finalRes);
    })
})