let functionInfo = [
    "Generally speaking, a function is a subprogram that can be called by code external (or internal in the case of recursion) to the function. Like the program itself, a function is composed of a sequence of statements called the function body. Values can be passed to a function, and the function will return a value.",
    "In JavaScript, functions are first-class objects, because they can have properties and methods just like any other object. What distinguishes them from other objects is that functions can be called. In brief, they are Function objects",
    "The parameters of a function call are the function's arguments. Arguments are passed to functions by value. If the function changes the value of an argument, this change is not reflected globally or in the calling function. However, object references are values, too, and they are special: if the function changes the referred object's properties, that change is visible outside the function",
    "When functions are used only once, a common pattern is an IIFE or an anonymous function"
];
let fnName;
let fnArguments;
let fnType;
let functionInfoIndex = 0;

window.addEventListener("load", function() {
    setActiveOnNavBar(02);
    document.getElementById("infoBox").innerHTML = functionInfo[functionInfoIndex];
    document.getElementById("prevFunctionInfoButton").addEventListener("click", function() {
        if (functionInfoIndex > 0) {
            document.getElementById("infoBox").innerHTML = functionInfo[--functionInfoIndex];
        }
    }, false);
    document.getElementById("nextFunctionInfoButton").addEventListener("click", function() {
        if (functionInfoIndex < (functionInfo.length - 1)) {
            document.getElementById("infoBox").innerHTML = functionInfo[++functionInfoIndex];
        }
    }, false);
    loadFunctionTypeList();
    document.getElementById("functionTypesSelect").addEventListener("change", function() {
        document.getElementById("selectFunctionSpan").innerHTML = "";
        document.getElementById("functionDetailsTable").innerHTML = ""
        document.getElementById("functionTryoutInputDiv").innerHTML = "";
        document.getElementById("functionTryoutOutputDiv").innerHTML = "";
        if (document.getElementById("functionTypesSelect").value != "") {
            loadFunctionList(document.getElementById("functionTypesSelect").value);
        }
    }, false);
}, false);

function nextInfoBoxText() {
    if (functionInfoIndex < (functionInfo.length - 1)) {
        document.getElementById("infoBox").innerHTML = functionInfo[++functionInfoIndex];
    }
}
function prevInfoBoxText() {
    if (functionInfoIndex > 0) {
        document.getElementById("infoBox").innerHTML = functionInfo[--functionInfoIndex];
    }
}
function loadFunctionTypeList() {
    try {
        let xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseXML) {
                console.log("function-types response XML" + this.responseXML);
                addFunctionTypeToSelect(xhr.responseXML.getElementsByTagName("type"));
            }
        }, false);
        xhr.open("GET", "./data/xml/function-types.xml", true);
        xhr.send(null);
    } catch (exception) {
        alert ("XHR for function types failed: " + exception.message);
    }
}
function addFunctionTypeToSelect (functionTypeList) {
    for (type of functionTypeList) {
        let elm = document.createElement("option");
        elm.setAttribute("value", type.childNodes[0].nodeValue);
        elm.innerHTML = type.childNodes[0].nodeValue;
        document.getElementById("functionTypesSelect").appendChild(elm);
    }
}
function loadFunctionList() {
    let functionText = document.createElement("span");
    functionText.innerHTML = "Select function: ";
    document.getElementById("selectFunctionSpan").appendChild(functionText);
    let functionSelect = document.createElement("select");
    functionSelect.setAttribute("id","functionSelect");
    document.getElementById("selectFunctionSpan").appendChild(functionSelect);
    let emptyOption = document.createElement("option");
    emptyOption.setAttribute("value", "");
    document.getElementById("functionSelect").appendChild(emptyOption);
    document.getElementById("functionSelect").addEventListener("change", function(evt) {
        document.getElementById("functionDetailsTable").innerHTML = "";
        document.getElementById("functionTryoutInputDiv").innerHTML = "";
        document.getElementById("functionTryoutOutputDiv").innerHTML = "";
        if (evt.target.value != "") {
            displayFunctionDetails(evt.target.value);
        }
    }, false);
    try {
        let xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseXML) {
                console.log("functions response XML" + this.responseXML);
                addFunctionToSelect(xhr.responseXML.getElementsByTagName("function"));
            }
        }, false);
        xhr.open("GET", "./data/xml/functions.xml", true);
        xhr.send(null);
    } catch (exception) {
        alert ("XHR for functions failed: " + exception.message);
    }
}
function addFunctionToSelect(functionList) {
    for (fn of functionList) {
        if (fn.getAttribute("type") == document.getElementById("functionTypesSelect").value) {
            let elm = document.createElement("option");
            elm.setAttribute("value", fn.children[0].childNodes[0].nodeValue);
            elm.innerHTML = fn.children[0].childNodes[0].nodeValue;
            document.getElementById("functionSelect").appendChild(elm);
        }
    }
}
function displayFunctionDetails (functionName) {
    try {
        let xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseXML) {
                console.log("specific function response XML" + this.responseXML);
                let functions = xhr.responseXML.getElementsByTagName("function");
                for (fn of functions) {
                    if (fn.getElementsByTagName("name")[0].childNodes[0].nodeValue == functionName) {
                        for (info of fn.children) {
                            let row = document.createElement("tr");
                            let td1 = document.createElement("td");
                            let td2 = document.createElement("td");
                            let td3 = document.createElement("td");
                            td1.innerHTML = (info.nodeName).replace("_"," ");
                            td2.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;"
                            td3.innerHTML = info.childNodes[0].nodeValue;
                            row.appendChild(td1);
                            row.appendChild(td2);
                            row.appendChild(td3);
                            document.getElementById("functionDetailsTable").appendChild(row);
                        } 
                        let tryOut = "<input type='text' id='userInput'/>";
                        tryOut +=  "." + functionName + "(";
                        if (fn.getElementsByTagName("arguments")[0].childNodes[0].nodeValue != "None") {
                            tryOut += "<input type='text' id='argsInput'/>";
                        }
                        tryOut += ")&nbsp;&nbsp;&nbsp;";
                        tryOut += "<input type='button' value='Go!' id='runFunctionButton'/>";
                        document.getElementById("functionTryoutInputDiv").innerHTML = tryOut;
                        document.getElementById("runFunctionButton").addEventListener("click",runFunction, false);
                        fnName = fn.getElementsByTagName("name")[0].childNodes[0].nodeValue;
                        fnArguments = fn.getElementsByTagName("arguments")[0].childNodes[0].nodeValue;
                        fnType = fn.getAttribute("type");
                    }
                }
            }
        }, false);
        xhr.open("GET","./data/xml/functions.xml", true);
        xhr.send(null);
    } catch (exception) {
        alert ("XHR for a specific function failed: " + exception.message);
    } 
}
function runFunction() {
    let userInput = document.getElementById("userInput").value;
    if (userInput != "") {
        let fnExecution = "(" + userInput + ")." + fnName + "(";
        if (fnArguments == 'None') {
            fnExecution += ");"
        } else {
            fnExecution += document.getElementById("argsInput").value + ");"
        }
        try {
            let output = eval (fnExecution);
            console.log("output : " + output);
            document.getElementById("functionTryoutOutputDiv").innerHTML = "<h3 class=\"text-white\">" + "Output:&nbsp;&nbsp;" + output + "</h3>";    
        } catch (e) {
            document.getElementById("functionTryoutOutputDiv").innerHTML = "<h3 class=\"text-danger\">" + "Error:&nbsp;&nbsp;" + e.message + "</h3>";    
        }
    } else {
        document.getElementById("functionTryoutOutputDiv").innerHTML = "<h3 class=\"text-danger\">Error:&nbsp;&nbsp;No input entered!</h3>"
    }


}
