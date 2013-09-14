function placeHolder(element, text) {
    var hintClass = "hint";

    element.value = text;
    addClass(element, hintClass);

    element.placeHolder = {};
    element.placeHolder.defaultText = text;

    var focus = function (event) {
        if (hasClass(element, hintClass)) {
            removeClass(element, hintClass);
            element.value = "";
        }
    }
    element.addEventListener("focus", focus, false);
    element.placeHolder.focus = focus;

    var blur = function (event) {
        if (element.value == '') {
            addClass(element, hintClass);
            element.value = element.placeHolder.defaultText;
        }
    }
    element.addEventListener("blur", blur, false);
    element.placeHolder.focus = blur;
}

//Определение положения элемента на странице
function offsetPosition(element) {
    var offsetLeft = 0, offsetTop = 0;
    if(element){
        do {
            offsetLeft += element.offsetLeft;
            offsetTop += element.offsetTop;
        } while (element = element.offsetParent);
    }
    return [offsetLeft, offsetTop];
}

function information(o, note) {
    if (note) {
        //Добавление события в ячейку
        var div = document.createElement("div");

        if (note.event) {
            var pEvent = document.createElement("p");
            pEvent.appendChild(document.createTextNode(note.event));
            div.appendChild(pEvent);
        }

        if (note.name) {
            var pName = document.createElement("p");
            pName.appendChild(document.createTextNode(note.name));
            div.appendChild(pName);
        }

        o.appendChild(div);

        return div;
    }
}

function createPopup(o, contentId, leftArrow, closeHidden, closeFunction, initFunction, cssHide){
    var obj = document.createElement('div');

    addClass(obj, "popup");
    if(leftArrow){
        addClass(obj, "leftarrowdiv");
        obj.style.top = (offsetPosition(o)[1] - 15) + 'px';
        obj.style.left = (offsetPosition(o)[0] + o.offsetWidth + 15) + 'px';
    }else{
        addClass(obj, "uparrowdiv");
        obj.style.top = (offsetPosition(o)[1] + o.offsetHeight + 10) + 'px';
        obj.style.left = offsetPosition(o)[0] + 'px';

        var upArrow = document.createElement('div');
        addClass(upArrow, "triangle-with-shadow");
        obj.appendChild(upArrow);
    }

    var closeButton = document.createElement("div");
    closeButton.innerHTML = "<img src='./img/close.png'/>";
    addClass(closeButton, "closeButton");
    if(closeHidden){
        addClass(closeButton, "hidden");
    }


    var content = document.getElementById(contentId);
    removeClass(content, "hidden");

    if(!cssHide){
        addClass(content, "contentPopup");
    }

    obj.close = function() {
        if (content) {
            addClass(content,  "hidden");
            removeClass(content, "contentPopup");

            document.body.appendChild(content);
        }

        if(closeFunction){
            closeFunction();
        }

        unHighlightCurrent(o);

        obj.parentNode ? obj.parentNode.removeChild(obj) : obj;
    }


    closeButton.addEventListener("click", obj.close, false);
    obj.appendChild(closeButton);
    obj.appendChild(content);

    document.body.appendChild(obj);

    if(initFunction){
        initFunction(o);
    }
    return obj;
}

function highlightPopup(node) {
    var div = createPopup(node, 'add', true, false, addClose, addInit);
    highlightCurrent(node);

    return div;
}

function highlightCurrent(node) {
    addClass(node, "highlightPopup");
}

function unHighlightCurrent(node) {
    removeClass(node, "highlightPopup");
}


function highlight(node) {
    addClass(node, "highlight");
}

//подсветка
var highlightedCell;
var popup;

function createCalendar(id, year, month) {
    var today = new Date();

    var dayInWeek = 7;
    var weekDay = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
    var monthName = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май',
        'Июнь', 'Июль', 'Август', 'Сентябрь',
        'Октябрь', 'Ноябрь', 'Декабрь'];
    var date = new Date(year, month);
    var dayCount = (new Date(year, month + 1, 0)).getDate();
    var dayNum = 1 - (date.getDay() == 0 ? dayInWeek : date.getDay());

    var parent = document.getElementById(id);
    parent.innerHTML = "";
    var table = document.createElement('table');
    table.className = "calendar";

    table.onclick = function (event) {
        event = event || window.event;
        var target = event.target || event.srcElement;

        while (target != table) {
            if (target.nodeName == 'TD') {
                if (highlightedCell != target) {
                    if (highlightedCell) {
                        removeClass(highlightedCell, "highlightPopup")
                        if (popup) {
                            popup.close();
                        }
                    }

                    highlightedCell = target;
                    popup = highlightPopup(target);
                }
                return;
            }
            target = target.parentNode;
        }
    }


    var controlTable = document.createElement('table');
    addClass(controlTable, "calControl");

    var tr = document.createElement('tr');

    // листать влево
    var leftButton = document.createElement("div");
    addClass(leftButton, "whiteButton");

    var leftButtonClick = function(){
        createCalendar("cal", year, (month - 1));
    };
    leftButton.addEventListener("click", leftButtonClick, false);

    var leftArrow = document.createElement("div");
    addClass(leftArrow, "arrow-left");
    leftButton.appendChild(leftArrow);

    var leftTd = document.createElement("td");
    leftTd.appendChild(leftButton);
    tr.appendChild(leftTd);

    // месяц год
    var monthAndYear = monthName[date.getMonth()] + ' ' + date.getFullYear();
    var monthAndYearTd = document.createElement('td');
    addClass(monthAndYearTd, "monthAndYear");
    monthAndYearTd.id = "monthAndYear";
    monthAndYearTd.date = date;
    monthAndYearTd.appendChild(document.createTextNode(monthAndYear));
    tr.appendChild(monthAndYearTd);

    // листать вправо
    var rightButton = document.createElement("div");
    addClass(rightButton, "whiteButton");

    var rightButtonClick = function(){
        createCalendar("cal", year, (month + 1));
    };
    rightButton.addEventListener("click", rightButtonClick, false);

    var rightArrow = document.createElement("div");
    addClass(rightArrow, "arrow-right");
    rightButton.appendChild(rightArrow);

    var rightTd = document.createElement("td");
    rightTd.appendChild(rightButton);
    tr.appendChild(rightTd);

    // сегодня
    var todayButton = document.createElement("div");
    addClass(todayButton, "whiteButton");

    var todayButtonClick = function() {
        createCalendar("cal", today.getFullYear(), today.getMonth());

        var todayElement = document.getElementById("today");
        highlight(todayElement);
    }
    todayButton.addEventListener("click", todayButtonClick, false);

    todayButton.appendChild(document.createTextNode('Сегодня'));

    var todayTd = document.createElement("td");
    todayTd.appendChild(todayButton);
    tr.appendChild(todayTd);

    controlTable.appendChild(tr);
    parent.appendChild(controlTable);

    //Вычисляем размер ячееек
    var rowCount = Math.abs(Math.floor((dayNum - dayCount) / dayInWeek));
    var headerHeight = document.body.clientHeight;
    var bottomOffset = 15;
    var cellSize = Math.floor((document.documentElement.clientHeight - headerHeight) / rowCount) - bottomOffset;
    parent.style.width = cellSize * dayInWeek + "px";

    //Ширина для header в соответсвии с шириной ячеек
    var header = document.getElementById("header");
    header.style.width = cellSize * dayInWeek + "px";

    //Если строк в календаре 6 то масштабируем высоту ячейки
    var cellWidth;
    if (rowCount == 6) {
        cellWidth = Math.floor((document.documentElement.clientHeight - headerHeight) / 5) - bottomOffset;
        header.style.width = cellWidth * dayInWeek + "px";
    }


    //календарь
    for (var row = 0; dayNum < dayCount; row++) {
        var tr = document.createElement('tr');
        table.appendChild(tr);

        for (var col = 0; col < dayInWeek; col++) {  // заполняем строку днями
            dayNum++;
            var dayTd = document.createElement('td');

            //установим высоту и ширину для ячейки
            if (rowCount == 6) {
                dayTd.style.width = cellWidth + "px";
                parent.style.width = cellWidth * dayInWeek + "px";

                dayTd.style.height = cellSize + "px";
            } else {
                dayTd.style.width = dayTd.style.height = cellSize + "px";
            }

            var dayText;
            var date = new Date(year, month, dayNum);
            if (row == 0) {
                dayText = weekDay[col] + ", " + date.getDate();
            } else {
                dayText = date.getDate();
            }

            if ((today.getMonth() == date.getMonth()) && (today.getFullYear() == date.getFullYear()) && (today.getDate() == date.getDate())) {
                dayTd.id = "today";
                highlight(dayTd);
            } else {
//                dayTd.id = "" + date.getDate() + date.getMonth() + date.getFullYear();
                dayTd.id = moment(date).format("DDMMYYYY");
            }

            // заполняем ячейку календаря
            var pDate = document.createElement("p");
            addClass(pDate, "date");
            pDate.appendChild(document.createTextNode(dayText));

            dayTd.appendChild(pDate);
            tr.appendChild(dayTd);

            //Проверка localstorage
            var event = JSON.parse(window.localStorage.getItem(dayTd.id));
            if (event) {
                addClass(dayTd, "eventHighlight");
                information(dayTd, event);
            }
        }
    }
    parent.appendChild(table);
}