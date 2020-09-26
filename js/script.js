const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
let dataStore = require('../data/store.json');

let currDayString = initCurrDay();
let prevDayString = initPrevDay();

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function stepBack() {
    let currDate = new Date(currDayString);
    let prevDate = new Date(prevDayString);

    currDate.setDate(currDate.getDate() - 1);
    prevDate.setDate(prevDate.getDate() - 1);

    currDayString = getDateString(currDate);
    prevDayString = getDateString(prevDate);

    refreshHeaders();
    loadDataStore();
}

function stepForward() {
    let currDate = new Date(currDayString);
    let prevDate = new Date(prevDayString);

    currDate.setDate(currDate.getDate() + 1);
    prevDate.setDate(prevDate.getDate() + 1);

    currDayString = getDateString(currDate);
    prevDayString = getDateString(prevDate);

    refreshHeaders();
    loadDataStore();
}

function displayHeaderDays() {
    const today = new Date();
    let tomorrow = new Date();
    let yesterday = new Date();

    tomorrow.setDate(today.getDate() + 1);
    yesterday.setDate(today.getDate() - 1);

    const currDate = new Date(currDayString);
    const prevDate = new Date(prevDayString);
    const todayString = getDateString(today);
    const tomorrowString = getDateString(tomorrow);
    const yesterdayString = getDateString(yesterday);

    if(getDateString(currDate) === yesterdayString) {
        document.getElementById("prevHeader").innerHTML = days[prevDate.getDay()];
        document.getElementById("currHeader").innerHTML = "Yesterday";
    } else if(getDateString(currDate) === todayString) {
        document.getElementById("prevHeader").innerHTML = "Yesterday";
        document.getElementById("currHeader").innerHTML = "Today";
    } else if(getDateString(prevDate) === todayString) {
        document.getElementById("prevHeader").innerHTML = "Today";
        document.getElementById("currHeader").innerHTML = "Tomorrow";
    } else if(getDateString(prevDate) === tomorrowString) {
        document.getElementById("prevHeader").innerHTML = "Tomorrow";
        document.getElementById("currHeader").innerHTML = days[currDate.getDay()];
    } else {
        document.getElementById("prevHeader").innerHTML = days[prevDate.getDay()];
        document.getElementById("currHeader").innerHTML = days[currDate.getDay()];
    }
}

function displayHeaderDates() {
    document.getElementById("currHeader").innerHTML = currDayString;
    document.getElementById("prevHeader").innerHTML = prevDayString;
}

function toggleHeaders() {
    if(document.getElementById("currHeader").innerHTML.includes(".")) {
        displayHeaderDays();
    } else {
        displayHeaderDates();
    }
}

function refreshHeaders() {
    if(document.getElementById("currHeader").innerHTML.includes(".")) {
        displayHeaderDates();
    } else {
        displayHeaderDays();
    }
}

function getDateString(date) {
    let month = (date.getMonth() + 1).toString();
    month = month.length === 2 ? month : "0" + month;

    let day = date.getDate().toString();
    day = day.length === 2 ? day : "0" + day;

    return month + "." + day + "." + date.getFullYear();
}

function addItem(isToday, uuid) {
    uuid = uuid == null ? uuidv4() : uuid; // if a new item, generate a UUID
    let itemDay = isToday ? currDayString : prevDayString;
    let item = dataStore[itemDay] == null ? null : dataStore[itemDay][uuid];

    let input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Finish all the things";

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.onchange = e => { handleCheckboxToggle(checkbox, input, uuid, true, itemDay); }

    let img = document.createElement("img");
    img.src = "../img/memo.png";

    let bottomDiv = document.createElement("div");
    bottomDiv.className = "bottom-div-collapsed";
    bottomDiv.setAttribute("contenteditable", "");
    bottomDiv.onblur = e => { handleComment(bottomDiv.textContent, uuid, itemDay); }

    let comment = document.createElement("button");
    comment.appendChild(img);
    comment.setAttribute("isOn", "true");
    comment.onclick = e => { 
        if(comment.getAttribute("isOn") === "true") {
            bottomDiv.className = "bottom-div-expanded";
            comment.setAttribute("isOn", "false");
            bottomDiv.textContent = item.comment;
        } else {
            bottomDiv.className = "bottom-div-collapsed";
            comment.setAttribute("isOn", "true");
        }
     }

    let div = document.createElement("div");
    div.className = "list-item";

    let divName = isToday ? "currItems" : "prevItems";

    if(item != null) {
        input.value = item.label;
        checkbox.checked = item.checked;
        handleCheckboxToggle(checkbox, input, uuid, false, itemDay);
    }

    let leftDiv = document.createElement("div");
    leftDiv.className = "left-div";
    leftDiv.appendChild(checkbox);
    leftDiv.appendChild(comment);

    let rightMargin = document.createElement("div");
    rightMargin.className = "right-margin";

    let rightDiv = document.createElement("div");
    rightDiv.className = "right-div";
    rightDiv.appendChild(input);

    div.appendChild(leftDiv);
    div.appendChild(rightDiv);
    div.appendChild(rightMargin);
    div.appendChild(bottomDiv);
    document.getElementById(divName).appendChild(div);

    if(item == null) {
        let newItem = {
            checked: false,
            label: "",
            comment: ""
        }
        if(dataStore[itemDay] == null) { dataStore[itemDay] = {}; }
        dataStore[itemDay][uuid] = newItem;
        persistToFile();
    }

    input.focus();
    input.onblur = e => {
        if(input.value === "") {
            document.getElementById(divName).removeChild(div);
            delete dataStore[itemDay][uuid];
            persistToFile();
        } else {
            persistField(itemDay, uuid, "label", input.value);
        }
    };
}

function handleComment(text, uuid, date) {
    persistField(date, uuid, "comment", text);
}

function handleCheckboxToggle(checkbox, input, uuid, persist, date) {
    if(checkbox.checked) {
        input.classList.add("fade-out");
    } else {
        input.classList.remove("fade-out");
    }
    if(persist) { persistField(date, uuid, "checked", checkbox.checked); }
}

function persistField(date, uuid, key, value) {
    dataStore[date][uuid][key] = value;
    persistToFile();
}

function persistToFile() {
    fs.writeFile('./data/store.json', JSON.stringify(dataStore), err => {
        if(err != null) { alert(err); }
    });
}

function initCurrDay() {
    return getDateString(new Date());
}

function initPrevDay() {
    let prevDay = new Date();
    prevDay.setDate(prevDay.getDate() - 1);
    return getDateString(prevDay);
}

function initNextDay() {
    let nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);
    return getDateString(nextDay);
}

function loadDataStore() {
    document.getElementById("currItems").innerHTML = '';
    document.getElementById("prevItems").innerHTML = '';
    if(dataStore[currDayString] != null) { Object.keys(dataStore[currDayString]).forEach(i => addItem(true, i)); }
    if(dataStore[prevDayString] != null) { Object.keys(dataStore[prevDayString]).forEach(i => addItem(false, i)); }
    document.activeElement.blur(); // deselect the last item
}