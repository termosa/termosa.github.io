var MIN_DESKTOP_WIDTH = 992;
var MIN_TABLET_WIDTH = 768;

function getTotalWidth(node) {
  var style = node.currentStyle || window.getComputedStyle(node);
  var width = node.clientWidth
      + parseInt(style.marginLeft, 10)
      + parseInt(style.marginRight, 10);

  return width;
}

var container = document.querySelector('ul');
var list = document.querySelectorAll('li');
var current = list[0];
var goPrev = document.querySelector('.icon-arrow-left');
var goNext = document.querySelector('.icon-arrow-right');

(function setupContainerWidth() {
  var width = 0;
  for (var i=list.length;i--;) {
    width += getTotalWidth(list[i]);
  }
  container.style.width = width + 'px';
})();

function shiftContainer(distance) {
  container.style.marginLeft =
      (parseInt(container.style.marginLeft, 10) || 0)
      + distance + 'px';
}

function shift(shift) {
  var step = Math.abs(shift);
  var distance = 0;
  var shifted = 0;
  var _current = current;

  if (shift < 0) {
    while (_current.previousElementSibling && shift++) {
      distance += getTotalWidth(_current.previousElementSibling);
      _current = _current.previousElementSibling;
    }
  } else if (shift > 0) {
    while (_current.nextElementSibling && shift--) {
      distance -= getTotalWidth(_current.nextElementSibling);
      _current = _current.nextElementSibling;
      shifted++;
    }
    if (shift !== -1 && step > shifted) distance = 0;
  }

  if (distance) {
    current = _current;
    shiftContainer(distance);
  }
}

function countSteps() {
  var width = window.innerWidth;
  if (width >= MIN_DESKTOP_WIDTH) return 3;
  if (width >= MIN_TABLET_WIDTH) return 2;
  return 1;
}

goNext.addEventListener('click', () => shift(countSteps()));
goPrev.addEventListener('click', () => shift(-countSteps()));
