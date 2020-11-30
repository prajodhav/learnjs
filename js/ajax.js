let response;
let codeFont = "Courier";
let codeColorPrimary = "#5BC4C1";
let codeColorSecondary = "#3E1BC0";
$(function () {
    setActiveOnNavBar(03);

    $("#jsOrJquerySelect").change(function () {
        $("#stepsTable").children() ? $("#stepsTable").empty() : false;
        $("#moreTable").children() ? $("#moreTable").empty() : false;
        $("#moreInfoSpan").children() ? $("#moreInfoSpan").empty() : false;
    });
    $("#jsonOrXmlSelect").change(function () {
        $("#stepsTable").children() ? $("#stepsTable").empty() : false;
        $("#moreTable").children() ? $("#moreTable").empty() : false;
        $("#moreInfoSpan").children() ? $("#moreInfoSpan").empty() : false;
    });
    $("#getStepsButton").click(function () {
        let useJsOrJquery = $("#jsOrJquerySelect").val();
        let useXmlOrJson = $("#jsonOrXmlSelect").val();
        $("#moreInfoSpan").children() ? $("#moreInfoSpan").empty() : false;
        switch (true) {
            case (useJsOrJquery == "JS" && useXmlOrJson == "XML"):
                ajaxUsingJsAndXml();
                addShowMoreButton();
                break;
            case (useJsOrJquery == "JS" && useXmlOrJson == "JSON"):
                ajaxUsingJsAndJson();
                addShowMoreButton();
                break;
            case (useJsOrJquery == "JQuery" && useXmlOrJson == "XML"):
                ajaxUsingJqueryAndXml();
                addShowMoreButton();
                break;
            case (useJsOrJquery == "JQuery" && useXmlOrJson == "JSON"):
                ajaxUsingJqueryAndJson();
                addShowMoreButton();
                break;
            default:
                alert("Error: unexpected values in JS-JQuery and/or JSON-XML Select");
                break;
        }
    })

    function addShowMoreButton() {
        let btn = document.createElement("input");
        $(btn).attr("class", "btn btn-info")
            .attr("type", "button")
            .attr("id", "showMoreInfoButton")
            .attr("value", "More")
            .click(clickMoreHandler);
        $("#moreInfoSpan").append(btn);
    }
    function ajaxUsingJsAndXml() {
        try {
            xhr = new XMLHttpRequest();
            xhr.addEventListener("readystatechange", function () {
                if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseXML) {
                    console.log("JS-XML response XML " + this.responseXML);
                    showDataforJsXmlCall(this.responseXML);
                }
            }, false);
            xhr.open("GET", "./data/xml/steps-js-xml-ajax.xml", true);
            xhr.send();
        } catch (exception) {
            alert("Error: unexpected return from JS-XML call : " + exception.message);
        }
    }

    function ajaxUsingJsAndJson() {
        try {
            xhr = new XMLHttpRequest();
            xhr.addEventListener("readystatechange", function () {
                if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText) {
                    console.log("JS-JSON response Text " + this.responseText);
                    showDataforJsJsonCall(this.responseText);
                }
            }, false);
            xhr.open("GET", "./data/json/steps-js-json-ajax.json", true);
            xhr.send();
        } catch (exception) {
            alert("Error: unexpected return from JS-JSON call : " + exception.message);
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

    function ajaxUsingJqueryAndJson() {
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
        document.getElementById("moreTable").innerHTML = "";
        let steps = responseXML.getElementsByTagName("step");
        for (step of steps) {
            let trow = document.createElement("tr");
            document.getElementById("stepsTable").append(trow);
            let td1 = document.createElement("td");
            td1.setAttribute("rowspan", step.children.length);
            td1.innerHTML = "Step " + step.getAttribute("number");
            trow.append(td1);
            for (let i = 0; i < step.children.length; i++) {
                let tcell = document.createElement("td");
                let type = step.children[i].nodeName;
                let text = step.children[i].childNodes[0].nodeValue;
                tcell.innerHTML = text;
                if (type == "code") {
                    tcell.style.fontFamily = codeFont;
                    tcell.style.color = codeColorPrimary;
                }
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
        response = responseText;
        document.getElementById("stepsTable").innerHTML = "";
        document.getElementById("moreTable").innerHTML = "";
        let steps = JSON.parse(responseText).steps;
        for (step of steps) {
            let trow = document.createElement("tr");
            document.getElementById("stepsTable").append(trow);
            let td1 = document.createElement("td");
            let keys = Object.keys(step)
            td1.setAttribute("rowspan", (keys.length - 1));
            td1.innerHTML = "Step " + step.number;
            trow.append(td1);;
            for (let i = 1; i < keys.length; i++) {
                let tcell = document.createElement("td");
                let type = keys[i];
                let text = step[type];
                tcell.innerHTML = text;
                if (type == "code") {
                    tcell.style.fontFamily = codeFont;
                    tcell.style.color = codeColorPrimary;
                }
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

    function showDataforJqueryXmlCall(data) {
        response = data;
        $("#stepsTable").empty();
        $("#moreTable").empty();
        let steps = $(data).find("step");
        $(steps).each(function () {
            let trow = document.createElement("tr");
            $("#stepsTable").append(trow);
            let td1 = document.createElement("td");
            td1.setAttribute("rowspan", $(this).children().length);
            td1.innerHTML = "Step " + $(this).attr("number");
            $(trow).append(td1);
            $(this).children().each(function (index) {
                let tcell = document.createElement("td");
                let type = $(this).prop("nodeName");
                let text = $(this).text();
                tcell.innerHTML = text;
                if (type == "code") {
                    tcell.style.fontFamily = codeFont;
                    tcell.style.color = codeColorPrimary;
                }
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
        response = data;
        $("#stepsTable").empty();
        $("#moreTable").empty();
        $(data.steps).each(function () {
            let trow = document.createElement("tr");
            $("#stepsTable").append(trow);
            let td1 = document.createElement("td");
            let keys = Object.keys(this);
            $(td1).attr("rowspan", (keys.length - 1)).text("Step " + $(this).attr("number"));
            console.log(this)
            $(trow).append(td1);
            let fstRow = true;
            $.each(this, function (key, value) {
                if (key != "number") {
                    let tcell = document.createElement("td");
                    if (key === 'code') {
                        $(tcell).append(value).css("font-family", codeFont);
                        $(tcell).append(value).css("color", codeColorPrimary);
                    } else {
                        $(tcell).append(value);
                    }
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

    function clickMoreHandler() {
        let useJsOrJquery = $("#jsOrJquerySelect").val();
        let useXmlOrJson = $("#jsonOrXmlSelect").val();
        switch (true) {
            case (useJsOrJquery == "JS" && useXmlOrJson == "XML"):
                showMoreDataforJsXmlCall();
                break;
            case (useJsOrJquery == "JS" && useXmlOrJson == "JSON"):
                showMoreDataforJsJsonCall();
                break;
            case (useJsOrJquery == "JQuery" && useXmlOrJson == "XML"):
                showMoreDataforJqueryXmlCall();
                break;
            case (useJsOrJquery == "JQuery" && useXmlOrJson == "JSON"):
                showMoreDataforJqueryJsonCall();
                break;
            default:
                alert("Error: unexpected values in JS-JQuery and/or JSON-XML Select");
                break;
        }
    }

    function showMoreDataforJsXmlCall() {
        document.getElementById("stepsTable").innerHTML = "";
        document.getElementById("moreTable").innerHTML = "";
        let miscellaneousDetails = response.getElementsByTagName("miscellaneous");
        for (miscellaneous of miscellaneousDetails) {
            let trow = document.createElement("tr");
            document.getElementById("moreTable").append(trow);
            let td1 = document.createElement("td");
            td1.setAttribute("rowspan", miscellaneous.children.length - 1);
            td1.innerHTML = miscellaneous.children[0].childNodes[0].nodeValue;
            trow.append(td1);
            for (let i = 1; i < miscellaneous.children.length; i++) {
                let tcell = document.createElement("td");
                let type = miscellaneous.children[i].nodeName;
                let text = miscellaneous.children[i].childNodes[0].nodeValue;
                tcell.innerHTML = text;
                if (type == "code") {
                    tcell.style.fontFamily = codeFont;
                    tcell.style.color = codeColorSecondary;
                }
                if (i == 1) {
                    trow.append(tcell);
                } else {
                    let newRow = document.createElement("tr");
                    document.getElementById("moreTable").append(newRow);
                    newRow.append(tcell);
                }
            }
        }
    }

    function showMoreDataforJsJsonCall() {
        document.getElementById("stepsTable").innerHTML = "";
        document.getElementById("moreTable").innerHTML = "";
        let miscellaneousDetails = JSON.parse(response).miscellaneous;
        for (miscellaneous of miscellaneousDetails) {
            let trow = document.createElement("tr");
            document.getElementById("moreTable").append(trow);
            let td1 = document.createElement("td");
            let keys = Object.keys(miscellaneous);
            td1.setAttribute("rowspan", (keys.length - 1));
            td1.innerHTML = miscellaneous.head;
            trow.append(td1);;
            for (let i = 1; i < keys.length; i++) {
                let tcell = document.createElement("td");
                let type = keys[i];
                let text = miscellaneous[type];
                tcell.innerHTML = text;
                if (type == "code") {
                    tcell.style.fontFamily = codeFont;
                    tcell.style.color = codeColorSecondary;
                }
                if (i == 1) {
                    trow.append(tcell);
                } else {
                    let newRow = document.createElement("tr");
                    document.getElementById("moreTable").append(newRow);
                    newRow.append(tcell);
                }
            }
        }
    }

    function showMoreDataforJqueryXmlCall() {
        $("#stepsTable").empty();
        $("#moreTable").empty();
        let miscellaneousDetails = $(response).find("miscellaneous");
        $(miscellaneousDetails).each(function (miscellaneous) {
            let trow = document.createElement("tr");
            $("#moreTable").append(trow);
            let td1 = document.createElement("td");
            td1.setAttribute("rowspan", $(this).children().length - 1);
            td1.innerHTML = $(this).children()[0].textContent;
            $(trow).append(td1);
            $(this).children().each(function (index) {
                if (index !== 0) {
                    let tcell = document.createElement("td");
                    let type = $(this).prop("nodeName");
                    let text = $(this).text();
                    tcell.innerHTML = text;
                    if (type == "code") {
                        tcell.style.fontFamily = codeFont;
                        tcell.style.color = codeColorSecondary;
                    }
                    if (index == 1) {
                        trow.append(tcell);
                    } else {
                        let newRow = document.createElement("tr");
                        $("#moreTable").append(newRow);
                        $(newRow).append(tcell);
                    }
                }
            });
        })
    }

    function showMoreDataforJqueryJsonCall() {
        $("#stepsTable").empty();
        $("#moreTable").empty();
        $(response.miscellaneous).each(function () {
            let trow = document.createElement("tr");
            $("#moreTable").append(trow);
            let td1 = document.createElement("td");
            let keys = Object.keys(this);
            $(td1).attr("rowspan", (keys.length - 1)).text($(this).attr("head"));
            $(trow).append(td1);
            let fstRow = true;
            $.each(this, function (key, value) {
                if (key !== "head") {
                    let tcell = document.createElement("td");
                    if (key === 'code') {
                        $(tcell).append(value).css("font-family", codeFont);
                        $(tcell).append(value).css("color", codeColorSecondary);
                    } else {
                        $(tcell).append(value);
                    }
                    if (fstRow == true) {
                        $(trow).append(tcell);
                        fstRow = false;
                    } else {
                        let newRow = document.createElement("tr");
                        $("#moreTable").append(newRow);
                        $(newRow).append(tcell);
                    }
                }
            })
        })
    }
});
