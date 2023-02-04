console.log("Hello main.js");

const searchNode = document.querySelector("div input#search-box");
const resultNode = document.querySelector("div.result");

let utility = {
    escapeQuotes: function(string) {
        return string.replace(new RegExp('"', 'g'),'\\"');
    },
    unescapeQuotes: function(string) {
        return string.replace(new RegExp('\\"', 'g'),'"').replace(/"/g , "");
    }
};

function debounce (callback , delay){

    let timer;

    function debouncedFunction(){
        clearTimeout(timer);
        timer = setTimeout(callback,delay);
    }

    return debouncedFunction;

}

function clearInnerHtmlByNode(node){
    node.innerHTML = "";
}

//finalData -> Stores the data
let finalData

function searchDataBy(){
    
    let input = searchNode.value;
    let autoCompleteNode = document.querySelector("div.auto-complete");
    let searchButton = document.querySelector("div.main button");

    if(input !== ""){
        fetch(`http://localhost:5500/data/${input}`)
        .then(res => res.json())
        .then((data) => {
    
            finalData = data;

            clearInnerHtmlByNode(autoCompleteNode);

            //Auto-complete            
            for(let i=0 ; i<10 ; i++){

                if(data[i] && data[i].Name){
                    let name = utility.unescapeQuotes(data[i].Name)
                    autoCompleteNode.innerHTML += `
                    <li class="auto-complete-data box">${name}</li>
                    `;
                }

                if(data[i] && data[i].Language){
                    let lang = utility.unescapeQuotes(data[i].Language);
                    autoCompleteNode.innerHTML += `
                    <li class="auto-complete-data box">${lang}</li>
                    `;
                }
                
                
            }

            let autoCompleteDataNodes = document.querySelectorAll("li.auto-complete-data");

            //handleSearchButtonByInput used to handle the output while selecting result from auto-populated data or while hitting the search button.

            autoCompleteDataNodes.forEach((eachNode) => {
                eachNode.addEventListener("click" , handleSearchButtonByInput)
            })

            //Search button 
            searchButton.addEventListener("click" , handleSearchButtonByInput)

        })
    }else{
        clearInnerHtmlByNode(autoCompleteNode)
    }


}

function handleSearchButtonByInput(event){

    //Clear the auto completed data
    clearInnerHtmlByNode(document.querySelector("div.auto-complete"));
    clearInnerHtmlByNode(resultNode);
    searchNode.value = ""
    
    //If event type is of li node, take pick value from it
    if(event.srcElement.nodeName === "LI"){
        let clickedValue = event.target.innerText;

        //Filtering is required here
        let filteredData = finalData.filter(obj => (obj.Name && obj.Name === clickedValue) || (obj.Language && obj.Language === clickedValue))
        

        //populateData by passing node
        populateData(resultNode , filteredData)

    } else {
        //Final data to be considered here anyway as it is fetched from the actual input in search node.
        populateData(resultNode , finalData)
    }

}

function getTemplateBydData(data){

    let keys = Object.keys(data);
    let startOfTemp = `<div class="result-item box">
    <ul>`;
    
    keys.forEach((eachKey , index) => {
        if(eachKey !== "type" && index < 4){
            startOfTemp += `<li class="card-details"> ${eachKey} - ${data[eachKey]}`;
        }
    })

    if(data.type === "country"){
        startOfTemp += `<li class="card-details"> <a href="/html/${data.Name}" target="_blank"> Click here to see more details of ${data.Name} </a> </li>`;
    }

    startOfTemp += `</ul>
    </div>`;

    return startOfTemp;

}

//Populate's data on the node 
function populateData(node , data){
    
    clearInnerHtmlByNode(node);
    
    data.forEach((eachData) => {

        let template = getTemplateBydData(eachData);

        node.innerHTML += template;
        
    })

}

searchNode.addEventListener("focus" , () => {
    resultNode.classList.add("transparent");
})

searchNode.addEventListener("blur" , () => {
    resultNode.classList.remove("transparent");
})

//Main event which gets triggered on every key, added debounce so the delay helps avoid calling multiple requests to server
searchNode.addEventListener("input" , debounce(searchDataBy , 300));