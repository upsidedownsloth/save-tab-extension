//define btn properties here to get element by id from HTML and use addEventListerner to evoke a function when the button is click.
// can remove js function from HTML and leave a cleaner code in HTML
let myLeads = []
const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")
const saveBtn = document.getElementById("tab-btn")

//get the leads from the local storage
const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"))

// check if leads is empthy, if not run the code
if (leadsFromLocalStorage) {
    myLeads = leadsFromLocalStorage
    //calling render function with myLeads as parameter
    render(myLeads)
}

// render function now have a better reusability by passing parameters when called
// now the function has no direct relationship with myLeads global variable. The relationship will only created when the function is called with myLeads as its parameter
function render(leads) {
    let listItems = ""
    for (let i = 0; i < leads.length; i++) {
        // listItems += "<li><a target='_blank' href='" + myLeads[i] + "'>" + myLeads[i] + "</a></li>"
        listItems += 
        //create a template string with ` string, use ${function} to escape the `
        `<li>
            <a target='_blank' href='${leads[i]}'>
            ${leads[i]}
            </a>
        </li>
        `
    }
    //using .innerHTML here instead of .textContent so that <li> will be rendered as HTML not text     
    // .innetHTML (DOM manipulation) comes with a cost. Should do it outside the loop
    ulEl.innerHTML = listItems
}

//addEventListernet, passing in the event "click"
inputBtn.addEventListener("click", function () {
    //push new inpu to the myLeads array
    myLeads.push(inputEl.value)
    //empty the input field
    inputEl.value = ""
    
    // save myLeads array to localStorage
    // localStorage only works with string, here is turing the array to string
    //                   (   Key   , Value                 )
    localStorage.setItem("myLeads", JSON.stringify(myLeads))

    render(myLeads)
})

saveBtn.addEventListener("click", function(){
    //grabbing url from the current tab
    // this code will only work when live as an extension
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        myLeads.push(tabs[0].url)
        localStorage.setItem("myLeads", JSON.stringify(myLeads))
        render(myLeads)
    })
})

deleteBtn.addEventListener("dblclick", function(){
    localStorage.clear()
    //setting myLeads back to empty
    myLeads = []
    //call renderleads to clear the URL list as it is now contain nothing
    render(myLeads)
})





