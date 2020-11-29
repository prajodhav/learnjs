let response;
$(function() {
    setActiveOnNavBar(03);

    $("#jsOrJquerySelect").change(function() {
        $("#stepsTable").children() ? $("#stepsTable").empty() : false;
        $("#moreInfoSpan").children() ? $("#moreInfoSpan").empty() : false;
    });
    $("#jsonOrXmlSelect").change(function() {
        $("#stepsTable").children() ? $("#stepsTable").empty() : false;
        $("#moreInfoSpan").children() ? $("#moreInfoSpan").empty() : false;
    });
    $("#getStepsButton").click(function() {
        let useJsOrJquery = $("#jsOrJquerySelect").val();
        let useXmlOrJson = $("#jsonOrXmlSelect").val();

        switch (true) {
            case (useJsOrJquery == "JS" && useXmlOrJson == "XML") :
                ajaxUsingJsAndXml();
                addShowMoreButton();
                break;
            case (useJsOrJquery == "JS" && useXmlOrJson == "JSON") :
                ajaxUsingJsAndJson();
                addShowMoreButton();
                break;
            case (useJsOrJquery == "JQuery" && useXmlOrJson == "XML") :
                ajaxUsingJqueryAndXml();
                addShowMoreButton();
                break;
            case (useJsOrJquery == "JQuery" && useXmlOrJson == "JSON") :
                ajaxUsingJqueryAndJson();
                addShowMoreButton();
                break;
            default :
                alert ("Error: unexpected values in JS-JQuery and/or JSON-XML Select");
                break;
        }
    })

    function addShowMoreButton() {
        let btn = document.createElement("input");
        $(btn).attr("class","btn btn-info")
            .attr("type","button")
            .attr("id","showMoreInfoButton")
            .attr("value","More")
            .click(function() {

            });
        $("#moreInfoSpan").append(btn);
    }
    function ajaxUsingJsAndXml() {
        try {
            xhr = new XMLHttpRequest();
            xhr.addEventListener("readystatechange", function() {
                if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseXML) {
                    console.log("JS-XML response XML " + this.responseXML);
                    showDataforJsXmlCall(this.responseXML);
                }
            }, false);
            xhr.open("GET","./data/xml/steps-js-xml-ajax.xml", true);
            xhr.send();
        } catch (exception) {
            alert ("Error: unexpected return from JS-XML call : " + exception.message);
        }
    }

    function ajaxUsingJsAndJson() {
        try {
            xhr = new XMLHttpRequest();
            xhr.addEventListener("readystatechange", function() {
                if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText) {
                    console.log("JS-JSON response Text " + this.responseText);
                    showDataforJsJsonCall(this.responseText);
                }
            }, false);
            xhr.open("GET","./data/json/steps-js-json-ajax.json", true);
            xhr.send();
        } catch (exception) {
            alert ("Error: unexpected return from JS-JSON call : " + exception.message);
        }

    }

    function ajaxUsingJqueryAndXml() {
        $.ajax({
            url: "./data/xml/steps-jquery-xml-ajax.xml", 
            success: function (data) {
                showDataforJqueryXmlCall(data);
            },
            error: function (xhr, textStatus, errorThrown) {
                alert("Error: unexpected return from JQUERY-JSON call : " + (errorThrown ? errorThrown : xhr.status));
            }
        });
    }    

    function ajaxUsingJqueryAndJson () {
        $.ajax({
            url: "./data/json/steps-jquery-json-ajax.json", 
            dataType: "json",
            success: function (data) {
                showDataforJqueryJsonCall(data);
            },
            error: function (xhr, textStatus, errorThrown) {
                alert("Error: unexpected return from JQUERY-JSON call : " + (errorThrown ? errorThrown : xhr.status));
            }
        });        
    }

    function showDataforJsXmlCall(responseXML) {
        response = responseXML;
        document.getElementById("stepsTable").innerHTML = "";
        let steps = responseXML.getElementsByTagName("step");
        for (step of steps) {
            let trow = document.createElement("tr");
            document.getElementById("stepsTable").append(trow);
            let td1 = document.createElement("td");
            td1.setAttribute("rowspan", step.children.length);
            td1.innerHTML = "Step " + step.getAttribute("number");
            trow.append(td1);
            for (let i=0; i < step.children.length; i++) {
                let tcell = document.createElement("td");
                let type = step.children[i].nodeName;
                let text = step.children[i].childNodes[0].nodeValue;
                tcell.innerHTML = text;
                (type == "code") ? tcell.style.fontFamily = "Courier" : false;
                if (i == 0) {
                    trow.append(tcell);
                } else {
                    let newRow = document.createElement("tr");
                    document.getElementById("stepsTable").append(newRow);
                    newRow.append(tcell);
                }
            }
        }
    }

    function showDataforJsJsonCall(responseText) {
        response = responseXML;
        document.getElementById("stepsTable").innerHTML = "";
        let steps = JSON.parse(responseText).steps;
        for (step of steps) {
            let trow = document.createElement("tr");
            document.getElementById("stepsTable").append(trow);
            let td1 = document.createElement("td");
            let keys = Object.keys(step)
            td1.setAttribute("rowspan", (keys.length -1));
            td1.innerHTML = "Step " + step.number;
            trow.append(td1);;
            for (let i=1; i<keys.length; i++) {
                let tcell = document.createElement("td");
                let type = keys[i];
                let text = step[type];
                tcell.innerHTML = text;
                (type == "code") ? tcell.style.fontFamily = "Courier" : false;
                if (i == 1) {
                    trow.append(tcell);
                } else {
                    let newRow = document.createElement("tr");
                    document.getElementById("stepsTable").append(newRow);
                    newRow.append(tcell);
                }
            }
        }       
    }

    function showDataforJqueryXmlCall (data) {
        response = responseXML;
        $("#stepsTable").empty();
        let steps = $(data).find("step");
        $(steps).each (function() {
            let trow = document.createElement("tr");
            $("#stepsTable").append(trow);
            let td1 = document.createElement("td");
            td1.setAttribute("rowspan", $(this).children().length);
            td1.innerHTML = "Step " + $(this).attr("number");
            $(trow).append(td1);
            $(this).children().each(function(index) {
                let tcell = document.createElement("td");
                let type = $(this).prop("nodeName");
                let text = $(this).text();
                tcell.innerHTML = text;
                (type == "code") ? tcell.style.fontFamily = "Courier" : false;
                if (index == 0) {
                    trow.append(tcell);
                } else {
                    let newRow = document.createElement("tr");
                    $("#stepsTable").append(newRow);
                    $(newRow).append(tcell);
                }
            });
        })
    }

    function showDataforJqueryJsonCall(data) {
        response = responseXML;
        $("#stepsTable").empty();
        $(data.steps).each(function() {
            let trow = document.createElement("tr");
            $("#stepsTable").append(trow);
            let td1 = document.createElement("td");
            let keys = Object.keys(this);
            $(td1).attr("rowspan", (keys.length - 1)).text("Step " + $(this).attr("number"));
            console.log(this)
            $(trow).append(td1);
            let fstRow = true;
            $.each (this,function(key, value) {
                if (key != "number") {
                    let tcell = document.createElement("td");
                    $(tcell).append(value).css("font-family", "Courier");
                    if (fstRow == true) {
                        $(trow).append(tcell);
                        fstRow = false;
                    } else {
                        let newRow = document.createElement("tr");
                        $("#stepsTable").append(newRow);
                        $(newRow).append(tcell);
                    }
                }
                
            })
        })
    }

});