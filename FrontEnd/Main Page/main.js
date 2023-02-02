console.log("Hello main.js");

const searchNode = document.querySelector("div input#search-box");

function debounce (callback , delay){

    let timer;

    function debouncedFunction(){
        clearTimeout(timer);
        timer = setTimeout(callback,delay);
    }

    return debouncedFunction;

}

function searchDataBy(){

    let input = searchNode.value;

    fetch(`http://localhost:5500/data/${input}`)
    .then(res => res.json())
    .then((response) => {

        console.log("🚀 ~ file: main.js:25 ~ .then ~ response", response)

        //With the filtered response, show some data to UI


        //
    })

}

searchNode.addEventListener("input" , debounce(searchDataBy , 300));