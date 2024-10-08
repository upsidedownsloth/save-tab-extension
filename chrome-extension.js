//define btn properties here to get element by id from HTML and use addEventListerner to evoke a function when the button is click.
// can remove js function from HTML and leave a cleaner code in HTML
let items = [] //current link items
const inputEl = document.getElementById("input-el")
const saveInputBtn = document.getElementById("save-input-btn")
const ulEl = document.getElementById("ul-el")
// const ulEl = document.getElementById("link-list")
const deleteAllBtn = document.getElementById("delete-all-btn")
const saveTabBtn = document.getElementById("save-tab-btn")

//get the leads from the local storage
const itemsFromLocalStorage = JSON.parse(localStorage.getItem("items"))

// check if leads is empthy, if not run the code
if (itemsFromLocalStorage) {
    items = itemsFromLocalStorage
    //calling render function with items as parameter
    render(items)
}

// render function now have a better reusability by passing parameters when called
// now the function has no direct relationship with items global variable. The relationship will only created when the function is called with items as its parameter
function render(leads) {
    let listItems = ""
    for (let i = 0; i < leads.length; i++) {
        listItems += 
        //create a template string with ` string, use ${function} to escape the `
        `<li class="eLink" id="${[i]}">
        <button class="deleteThis" id="del_${i}"> &#8722; </button>
            <a target='_blank' href='${leads[i]}'>${leads[i]}</a>
        </li>
        `
    }
    //this.parentElement.id give the div id
    //using .innerHTML here instead of .textContent so that <li> will be rendered as HTML not text     
    // .innetHTML (DOM manipulation) comes with a cost. Should do it outside the loop
    ulEl.innerHTML = listItems
    
    let delThisBtn = document.getElementsByClassName('deleteThis')
    for(delbtn of delThisBtn){
        delbtn.addEventListener("click", function(){
            deleteThis(this)
        })
    }
}

//addEventListernet, passing in the event "click"
saveInputBtn.addEventListener("click", addURL)
inputEl.addEventListener("keyup", function(e){
    if(e.key == "Enter"){
      addURL()
    }
})

saveTabBtn.addEventListener("click", function(){
    //grabbing url from the current tab
    // this code will only work when live as an extension
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        items.push(tabs[0].url)
        localStorage.setItem("items", JSON.stringify(items))
        render(items)
    })
})

deleteAllBtn.addEventListener("dblclick", function(){
    localStorage.clear()
    //setting items back to empty
    items = []
    //call renderleads to clear the URL list as it is now contain nothing
    render(items)
})

function addURL(){
    //push new input to the items array
    if(inputEl.value != ""){
        items.push(inputEl.value)
        //empty the input field after push
        inputEl.value = ""
        // save items array to localStorage
        // localStorage only works with string, here is turing the array to string
        //                   (   Key   , Value             )
        localStorage.setItem("items", JSON.stringify(items))
        render(items)
    }
}


function deleteThis(el){
    let rmLink = el.parentElement.id
    let rmDiv = document.getElementById(rmLink) // this work fine
    items.splice(rmLink, 1) //remove from rmLink index
    rmDiv.parentNode.removeChild(rmDiv) //remove DOM
    JSON.parse(localStorage.getItem("items")) //check item in local storage
    localStorage.setItem("items", JSON.stringify(items)) //update local storage with current list in items
    render(items) //update ID in DOM
}