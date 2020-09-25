const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
let dataStore = require('../data/store.json');

let currDayString = initCurrDay();
let prevDayString = initPrevDay();

function toggleHeaders() {
    let text = document.getElementById("todayHeader").innerHTML;
    if(text === "Today") {
        let today = new Date();
        let yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        document.getElementById("todayHeader").innerHTML = currDayString;
        document.getElementById("yesterdayHeader").innerHTML = prevDayString;
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

function addItem(isToday, uuid) {
    uuid = uuid == null ? uuidv4() : uuid; // if a new item, generate a UUID
    let itemDay = isToday ? currDayString : prevDayString;
    let item = isToday ? dataStore[itemDay][uuid] : dataStore[itemDay][uuid];

    let input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Finish all the things";

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.onchange = e => { handleCheckboxToggle(checkbox, input, uuid, true, itemDay); }

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
        handleCheckboxToggle(checkbox, input, uuid, false, itemDay);
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

    if(item == null) {
        let newItem = {
            checked: false,
            label: "",
            comment: ""
        }
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

function loadDataStore() {
    Object.keys(dataStore[currDayString]).forEach(i => addItem(true, i));
    Object.keys(dataStore[prevDayString]).forEach(i => addItem(false, i));
}