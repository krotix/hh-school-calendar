VerticalScroll = function (scroller, menu)
{
    this.canDrag = false;
    this.prepared = false;

    this.shift_y;
    this.delta;

    this.scroller = scroller;
    this.menu = menu;

    this.scrollerStartShift;
    this.menuStartShift;

    this.scrollerTrackWidth = 220;
    this.menuTrackWidth;

    this.scrollerWidth;
    this.menuWidth = 240;

    this.step;

    this.dontmove = false;

    this.a = false;

    this.prepare = function()
    {
        if(get(this.scroller) && get(this.menu))
        {
            this.scrollerTrackWidth = parseInt(document.getElementById("col2").style.height);
            this.menuWidth = parseInt(document.getElementById("vScrollContent").style.height);

            this.scroller = get(this.scroller);
            this.menu = get(this.menu);

            this.scroller.style.top = 0 + "px";
            this.menu.style.marginTop = 0 + "px";
            this.scrollerStartShift = 0;
            this.menuStartShift = 0;

            this.menuTrackWidth = this.menu.offsetHeight + this.menuStartShift;

            this.scrollerWidth = Math.round( (this.menuWidth * this.scrollerTrackWidth) / this.menuTrackWidth );

            this.scrollerWidth = (this.scrollerWidth < 16) ?  16 : this.scrollerWidth;

            // максимальная ширина скроллера - ширина трэка
            this.scrollerWidth = (this.scrollerWidth > this.scrollerTrackWidth) ?  this.scrollerTrackWidth : this.scrollerWidth;

            // устанавливаем ширину скроллера 
            this.scroller.style.paddingBottom = this.scrollerWidth + "px";

            // теперь принимаем за скроллер точку (его левую границу), все расчеты будем производить относительно нее
            // задаем ширину трэка скроллера и меню
            this.scrollerTrackWidth -= this.scrollerWidth;
            this.menuTrackWidth -= this.menuWidth;

            // рассчитываем коэффициэнт
            this.delta = this.menuTrackWidth / this.scrollerTrackWidth;

            this.prepared = true;
        }
        return false;
    }

    this.setStep = function()
    {
        this.step = Math.round(this.menu.getElementsByTagName("td")['0'].offsetHeight * this.scrollerTrackWidth / this.menuTrackWidth);
    }

    this.setPosition = function(newPosition)
    {
        if(newPosition <= this.scrollerTrackWidth + this.scrollerStartShift && newPosition >= this.scrollerStartShift)
        {
            this.scroller.style.top = newPosition + "px";
        }
        else
        {
            if(newPosition >= this.scrollerTrackWidth + this.scrollerStartShift)
            {
                this.scroller.style.top = this.scrollerTrackWidth + this.scrollerStartShift + "px";
            }
            if(newPosition <= this.scrollerStartShift)
            {
                this.scroller.style.top = this.scrollerStartShift + "px";
            }
        }
        this.menu.style.marginTop = Math.round( (parseInt(this.scroller.style.top) - this.scrollerStartShift) * this.delta * (-1) ) + this.menuStartShift + "px";
        return false;
    }

    this.drag = function(event)
    {
        if (this.prepared)
        {
            this.canDrag = true;
            this.shift_y = event.clientY - parseInt(this.scroller.style.top);
        }
        return false;
    }

    this.movescroller = function(event)
    {
        if (this.prepared && !this.dontmove)
        {
            this.setStep();
            var clickY = event.layerY ? event.layerY : event.offsetY;
            var currentPosition = parseInt(this.scroller.style.top);
            var i = (clickY > currentPosition) ? 1 : -1;
            var newPosition = 2*i*this.step + parseInt(this.scroller.style.top);
            this.setPosition(newPosition);
        }
        else
        {
            this.dontmove = false;
        }
        return false;
    }

    this.move = function(event)
    {
        if (this.prepared && this.canDrag)
        {
            this.setPosition(event.clientY-this.shift_y);
        }
        return false;
    }

    this.drop = function()
    {
        this.canDrag=false;
    }

    this.scrollerClickHandler = function()
    {
        this.dontmove=true;
    }

    this.wheel = function(event)
    {
        var delta = 0;
        if (event.wheelDelta)
        {
            // IE и Safari
            delta = event.wheelDelta/120;
        }
        else if (event.deltaY)
        {
            //Mozilla
            delta = -event.deltaY;
        }

        if (delta)
        {
            var i = (delta < 0) ? 1 : -1;
            this.setStep()
            var currentPosition = parseInt(this.scroller.style.top);
            var newPosition = i*this.step + currentPosition;
            this.setPosition(newPosition);

            //Отменяем всплытие
            event.preventDefault ? event.preventDefault() : (event.returnValue = false);

            return false;
        }
    }
}

function get(id)
{
    return document.getElementById(id);
}

var vertical;

function init()
{
    function handleOnMouseUp(event)
    {
        vertical.drop(event);
    }
    function handleOnMouseMove(event)
    {
        vertical.move(event);
    }


// vertical
    function handleOnClickBarVertical(event)
    {
        vertical.movescroller(event);
    }
    function handleOnMouseDownVertical(event)
    {
        vertical.drag(event);
    }
    function handleOnClickVertical(event)
    {
        vertical.scrollerClickHandler(event);
    }
    function handleOnMouseWheelVertical(event)
    {
        vertical.wheel(event);
    }

    vertical = new VerticalScroll('scrollbar', 'searchList');

    vertical.prepare();
    document.onmousemove = handleOnMouseMove;
    window.onmouseup = handleOnMouseUp;
    get('scrollingTrack').onclick = handleOnClickBarVertical;

    get('scrollbar').onmousedown = handleOnMouseDownVertical;
    get('scrollbar').onmouseup = handleOnMouseUp;
    get('scrollbar').onclick = handleOnClickVertical;

    if (get('vScrollContent').addEventListener)
        get('vScrollContent').addEventListener('wheel', handleOnMouseWheelVertical, false);
    get('vScrollContent').onmousewheel = handleOnMouseWheelVertical;
}

