let numYesterdayItems = 0;
let numTodayItems = 0;

function toggleHeaders() {
    let text = document.getElementById("todayHeader").innerHTML;
    if(text === "Today") {
        let today = new Date();
        let yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        setElementToDate("todayHeader", today);
        setElementToDate("yesterdayHeader", yesterday);
    } else {
        document.getElementById("todayHeader").innerHTML = "Today";
        document.getElementById("yesterdayHeader").innerHTML = "Yesterday";
    }
}

function setElementToDate(element, date) {
    let month = (date.getMonth() + 1).toString();
    month = month.length === 2 ? month : "0" + month;

    let day = date.getDate().toString();
    day = day.length === 2 ? day : "0" + day;

    document.getElementById(element).innerHTML = month + "." + day + "." + date.getFullYear();
}

function addItem(isToday) {
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    let img = document.createElement("img");
    img.src = "../img/memo.png";

    let link = document.createElement("a");
    link.appendChild(img);

    let input = document.createElement("input");
    input.type = "text";

    let div = document.createElement("div");
    div.className = "list-item";

    let divName;

    if(isToday) {
        divName = "todayItems";
        numTodayItems++;
        checkbox.id = "today_item_" + numTodayItems;
        input.placeholder = "finish item " + numTodayItems;
    } else {
        divName = "yesterdayItems";
        numYesterdayItems++;
        checkbox.id = "yesterday_item_" + numYesterdayItems;
        input.placeholder = "finish item " + numYesterdayItems;
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
}