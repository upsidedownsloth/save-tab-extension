//define btn properties here to get element by id from HTML and use addEventListerner to evoke a function when the button is click.
// can remove js function from HTML and leave a cleaner code in HTML
let items = [] //current link items
const inputURL = document.getElementById("input-URL-el")
const inputTitle = document.getElementById("input-title-el")
const saveInputBtn = document.getElementById("save-input-btn")
const ulEl = document.getElementById("ul-el")
// const ulEl = document.getElementById("link-list")
const deleteAllBtn = document.getElementById("delete-all-btn")
const saveTabBtn = document.getElementById("save-tab-btn")
const inputWarning = document.getElementById("input-warning")

//get the leads from the local storage
const itemsFromLocalStorage = JSON.parse(localStorage.getItem("items"))

// object constructor
function SiteDetails(url, title){
    this.url = url
    this.title = title
}

// check if leads is empthy, if not run the code
if (itemsFromLocalStorage) {
    items = itemsFromLocalStorage
    //calling render function with items as parameter
    render(items)
}

// render function now have a better reusability by passing parameters when called
// now the function has no direct relationship with items global variable. The relationship will only created when the function is called with items as its parameter
function render(list) {
    let listItems = ""
    for (let i = 0; i < list.length; i++) {
        listItems += 
        //create a template string with ` string, use ${function} to escape the `
        `<li class="eLink" id="${[i]}">
        <button class="deleteThis" id="del_${i}"> &#8722; </button>
            <a target='_blank' href='${list[i].url}'>${list[i].title}</a>
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
saveInputBtn.addEventListener("click", (e) => {addURL(inputURL.value, inputTitle.value)})
document.querySelectorAll("input").forEach((element) => {
    element.addEventListener("keyup", function(e){
        if(e.key == "Enter"){
          addURL(inputURL.value, inputTitle.value)
        }
    });
})

saveTabBtn.addEventListener("click", function(){
    //grabbing url from the current tab
    // this code will only work when live as an extension
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        // items.push(tabs[0].url)
        items.push(new SiteDetails(tabs[0].url, tabs[0].title))
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

function addURL(url, title){
    //push new input to the items array
    if(inputURL.value != "" && inputTitle.value != ""){
        inputWarning.classList.add("hidden")
        items.push(new SiteDetails(url, title))
        //empty the input fields after push
        inputURL.value = ""
        inputTitle.value = ""
        // save items array to localStorage
        // localStorage only works with string, here is turing the array to string
        //                   (   Key   , Value             )
        localStorage.setItem("items", JSON.stringify(items))
        render(items)
    }else{
        inputWarning.classList.remove("hidden")
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