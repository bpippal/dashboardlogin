console.log("Hello main.js");

const searchNode = document.querySelector("div input#search-box");

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

function handleSearchButtonByInput(event){

    let resultNode = document.querySelector("div.result");

    //Clear the auto completed data
    clearInnerHtmlByNode(document.querySelector("div.auto-complete"));
    clearInnerHtmlByNode(resultNode);
    searchNode.value = ""
    
    //If event type is of li node, take pick value from it
    if(event.srcElement.nodeName === "LI"){
        let clickedValue = event.target.innerText;

        //Filtering is required here

        let filteredData = finalData.filter(obj => (obj.Name && obj.Name === clickedValue) || (obj.Language && obj.Language === clickedValue))
        

        filteredData.forEach((eachData) => {
            resultNode.innerText += JSON.stringify(eachData);
        })

    } else {
    //If event type is of button, take value from somewhere ? 
        //Final data to be considered here anyway as it is fetched from the actual input in search node.

        finalData.forEach((eachData) => {
            resultNode.innerText += JSON.stringify(eachData);
        })

    }

}

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
                    <li class="auto-complete-data">${name}</li>
                    `;
                }

                if(data[i] && data[i].Language){
                    let lang = utility.unescapeQuotes(data[i].Language);
                    autoCompleteNode.innerHTML += `
                    <li class="auto-complete-data">${lang}</li>
                    `;
                }
                
                
            }

            let autoCompleteDataNodes = document.querySelectorAll("li.auto-complete-data");

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

searchNode.addEventListener("input" , debounce(searchDataBy , 300));