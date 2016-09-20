angular.module('slider', ['ngTouch'])

.constant('MIN_DESKTOP_WIDTH', 992)
.constant('MIN_TABLET_WIDTH', 768)

.directive('videoSlide', function() {
  return {
    restrict: 'A',
    link: function(scope, element) {
      scope.$emit('slide.register', element);
    }
  };
})

.service('getElementTotalWidth', [
  '$window',
  function($window) {
    return function getElementTotalWidth(element) {
      var node = element[0];
      var style = node.currentStyle || $window.getComputedStyle(node);
      var width = node.clientWidth
          + parseInt(style.marginLeft, 10)
          + parseInt(style.marginRight, 10);

      return width;
    };
  }
])

.controller('videoSlider', [
  '$scope',
  'getElementTotalWidth',
  'MIN_DESKTOP_WIDTH',
  'MIN_TABLET_WIDTH',
  function($scope, getElementTotalWidth, MIN_DESKTOP_WIDTH, MIN_TABLET_WIDTH) {
    var vm = this;
    var slides = [];
    var currentSlide = angular.element();

    vm.slidesList = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    $scope.$on('slide.register', function(e, slide) {
      e.stopPropagation();
      if (slides.length === 0) currentSlide = slide;
      slides.push(slide);
      updateSlidesStyle(slides);
    });

    vm.containerSize = 0;
    vm.shift = 0;
    vm.getSlidesStyle = function() {
      return {
        'margin-left': vm.shift + 'px',
        'width': vm.containerSize ? vm.containerSize + 'px' : 'initial'
      };
    };

    vm.hasPrevSlides = function() {
      return !!currentSlide.prev().length;
    };

    vm.hasNextSlides = function() {
      return currentSlide.nextAll().length >= countSteps();
    };

    vm.prev = function() { currentSlide = moveSlides(currentSlide, -countSteps()); };
    vm.next = function() { currentSlide = moveSlides(currentSlide, countSteps()); };

    function countSteps() {
      var width = window.innerWidth;
      if (width >= MIN_DESKTOP_WIDTH) return 3;
      if (width >= MIN_TABLET_WIDTH) return 2;
      return 1;
    }

    function setShift(shift) {
      vm.shift += shift;
    }

    function moveSlides(from, steps) {
      var absSteps = Math.abs(steps);
      var shift = 0;
      var shifted = 0;
      var current = from;

      if (steps < 0) {
        while (current.prev().length && steps++) {
          shift += getElementTotalWidth(current.prev());
          current = current.prev();
        }
      } else if (steps > 0) {
        while (current.next().length && steps--) {
          shift -= getElementTotalWidth(current.next());
          current = current.next();
          shifted++;
        }
        if (steps !== -1 && absSteps > shifted) shift = 0;
      }

      if (shift) {
        setShift(shift);
        return current;
      }

      return from;
    }

    function updateSlidesStyle(slides) {
      var width = 0;
      for (var i = slides.length; i--;) {
        width += getElementTotalWidth(slides[i]);
      }
      vm.containerSize = width;
    }
  }
])

;
