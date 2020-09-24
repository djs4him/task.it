let dataStore = require('../data/store.json');
let numItems = 0;

function toggleHeaders() {
    let text = document.getElementById("todayHeader").innerHTML;
    if(text === "Today") {
        let today = new Date();
        let yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        document.getElementById("todayHeader").innerHTML = getDateString(today);
        document.getElementById("yesterdayHeader").innerHTML = getDateString(yesterday);
    } else {
        document.getElementById("todayHeader").innerHTML = "Today";
        document.getElementById("yesterdayHeader").innerHTML = "Yesterday";
    }
}

function getDateString(date) {
    let month = (date.getMonth() + 1).toString();
    month = month.length === 2 ? month : "0" + month;

    let day = date.getDate().toString();
    day = day.length === 2 ? day : "0" + day;

    return month + "." + day + "." + date.getFullYear();
}

function addItem(isToday, item) {
    numItems++;

    let input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Finish all the things";

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "item_" + numItems;
    checkbox.onchange = e => { handleCheckboxToggle(checkbox, input); };

    let img = document.createElement("img");
    img.src = "../img/memo.png";

    let link = document.createElement("a");
    link.appendChild(img);

    let div = document.createElement("div");
    div.className = "list-item";

    let divName = isToday ? "todayItems" : "yesterdayItems";

    if(item != null) {
        input.value = item.label;
        checkbox.checked = item.checked;
        handleCheckboxToggle(checkbox, input);
    }

    let leftDiv = document.createElement("div");
    leftDiv.className = "left-div";
    leftDiv.appendChild(checkbox);
    leftDiv.appendChild(link);

    let rightMargin = document.createElement("div");
    rightMargin.className = "right-margin";

    let rightDiv = document.createElement("div");
    rightDiv.className = "right-div";
    rightDiv.appendChild(input);

    div.appendChild(leftDiv);
    div.appendChild(rightDiv);
    div.appendChild(rightMargin);
    document.getElementById(divName).appendChild(div);

    input.focus();
    input.onblur = e => {
        if(input.value === "") {
            document.getElementById(divName).removeChild(div);
        }
    };
}

function handleCheckboxToggle(checkbox, input) {
    if(checkbox.checked) {
        input.classList.add("fade-out");
    } else {
        input.classList.remove("fade-out");
    }
}

function loadDataStore() {
    let today = new Date();
    let yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    let todayString = getDateString(today);
    let yesterdayString = getDateString(yesterday);

    dataStore[todayString].forEach(i => addItem(true, i));
    dataStore[yesterdayString].forEach(i => addItem(false, i));
}