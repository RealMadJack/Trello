(function () {
"use strict"

function getCoords(elem) {
    let box = elem.getBoundingClientRect();

    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };
}

function findDroppable(e, dragObj, container) {
  dragObj.hidden = true;

  var elem = document.elementFromPoint(e.clientX, e.clientY);

  dragObj.hidden = false;

  if (elem === null) {
    return null;
  } else if (!elem.closest(container)) {
    return null;
  }

  return elem.closest(container).appendChild(dragObj);
}


function Trello() {
    let add = document.querySelectorAll('.btn') || null,
        card = document.querySelectorAll('.trello__card') || null,
        input = document.querySelector('.trello__input') || null,
        dragZone;

    this.add = add;
    this.card = card;
    this.dragZone = dragZone;
    this.input = input;

    this.init();
}

Trello.prototype.addCard = function () {
    let i, max = this.add.length,
        self = this;

    for (i = 0; i < max; i++) {
        this.add[i].addEventListener('click', function (e) {
            if (!self.input.value) return;

            let target = e.target,
                wrapper,
                inputVal = {},
                newCard = document.createElement('div');

            inputVal.text = self.input.value;
            self.input.value = null;

            wrapper = target.closest('.trello__wrapper');

            newCard.className = 'trello__card';
            newCard.textContent = inputVal.text;

            wrapper.appendChild(newCard);
        }, false);
    }
}

Trello.prototype.onMouseDown = function (e) {
    if (e.which !== 1) {
        return;
    }

    let dragObj = {},
        coords,
        shiftX,
        shiftY;

    this.dragZone = e.target.closest('.trello__card');

    if (!this.dragZone) return;

    dragObj.elem = this.dragZone;
    coords = getCoords(dragObj.elem);

    shiftX = e.pageX - coords.left;
    shiftY = e.pageY - coords.top;

    dragObj.downX = e.pageX;
    dragObj.downY = e.pageY;

    document.onmousemove = function (e) {
        if (!dragObj.elem) return;

        dragObj.elem.classList.add('active');
        dragObj.elem.style.top = e.pageY - shiftY - 10 + 'px';
        dragObj.elem.style.left = e.pageX - shiftX + 'px';
    };

}

Trello.prototype.onMouseUp = function (e) {
    let target = e.target,
        card = target.closest('.trello__card'),
        wrapper = '.trello__wrapper';

    if (!card) return;

    document.onmousemove = null;

    findDroppable(e, card, wrapper);

    card.classList.remove('active');
    card.style.cssText = "top: ''; left: '';";
}

Trello.prototype.init = function () {
    this.addCard();
    document.onmousedown = this.onMouseDown;
    document.onmouseup = this.onMouseUp;
}

let trello = new Trello();

})();
