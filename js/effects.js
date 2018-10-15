'use strict';

(function () {

  var MAX_RESIZE_VALUE = 100;
  var RESIZE_STEP = 25;
  var PIN_WIDTH = 18;
  var LEVEL_LINE_WIDTH = 455;
  var PHOBOS_EFFECT = 33.33;
  var BRIGHTNESS_EFFECT = 50;
  var MIN_BRIGHTNESS_EFFECT = 1;
  var MAX_EFFECT_VALUE = 100;

  var effectsList = document.querySelector('.effects__list');

  var effectLevel = document.querySelector('.img-upload__effect-level');
  var levelLine = effectLevel.querySelector('.effect-level__line');
  var levelPin = levelLine.querySelector('.effect-level__pin');
  var levelDepth = levelLine.querySelector('.effect-level__depth');
  var levelValue = effectLevel.querySelector('.effect-level__value');

  var uploadSizeScale = document.querySelector('.img-upload__scale');
  var resizeSmaller = uploadSizeScale.querySelector('.scale__control--smaller');
  var resizeBigger = uploadSizeScale.querySelector('.scale__control--bigger');
  var sizeValue = uploadSizeScale.querySelector('.scale__control--value');

  window.effects = {
    MAX_RESIZE_VALUE: MAX_RESIZE_VALUE,
    currentTransformScale: 1,
    currentScaleValue: MAX_RESIZE_VALUE,
    sizeValue: sizeValue,
    effectLevel: effectLevel,
  };

  var calcPowerEffect = function (pinPosition) {

    levelValue.value = pinPosition + PIN_WIDTH / 2;
    var currentPower = MAX_EFFECT_VALUE * pinPosition / LEVEL_LINE_WIDTH;
    return currentPower;
  };

  var tuneEffect = function (power) {

    var currentFilter = window.uploadPhoto.uploadPreview.classList[1].split('--')[1];

    var currentFilterToImageStyleFilter = {
      'chrome': 'grayscale(' + power / MAX_EFFECT_VALUE + ')',
      'sepia': 'sepia(' + power / MAX_EFFECT_VALUE + ')',
      'marvin': 'invert(' + power + '%)',
      'phobos': 'blur(' + (power / PHOBOS_EFFECT).toFixed(2) + 'px)',
      'heat': 'brightness(' + (power / BRIGHTNESS_EFFECT + MIN_BRIGHTNESS_EFFECT) + ')',
      'none': 'none'
    };

    window.uploadPhoto.uploadPreview.style.filter = currentFilterToImageStyleFilter[currentFilter];

    return window.uploadPhoto.uploadPreview.style.filter;
  };

  var getCoordX = function (elem) {

    return elem.getBoundingClientRect().left;
  };

  levelPin.addEventListener('mousedown', function (evt) {

    var pinCoord = getCoordX(levelPin);
    var shiftX = evt.pageX - pinCoord;
    var lineCoord = getCoordX(levelLine);

    var mouseMoveHandler = function (evtMove) {

      var newCoord = evtMove.pageX - shiftX - lineCoord + PIN_WIDTH / 2;

      if (newCoord < 0) {
        newCoord = 0;
      } else if (newCoord > LEVEL_LINE_WIDTH) {
        newCoord = LEVEL_LINE_WIDTH;
      }

      levelPin.style.left = newCoord * MAX_EFFECT_VALUE / LEVEL_LINE_WIDTH + '%';
      levelDepth.style.width = newCoord * MAX_EFFECT_VALUE / LEVEL_LINE_WIDTH + '%';
      tuneEffect(calcPowerEffect(levelPin.offsetLeft));

    };

    var mouseUpHandler = function () {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
      tuneEffect(calcPowerEffect(levelPin.offsetLeft));
    };
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });

  var changeEffect = function (effectName) {
    var elementClassList = window.uploadPhoto.uploadPreview.classList;
    elementClassList.remove(elementClassList[1]);
    elementClassList.add('effects__preview--' + effectName);
    if (effectName === 'none') {
      effectLevel.classList.add('hidden');
    } else {
      effectLevel.classList.remove('hidden');
    }
  };

  effectsList.addEventListener('click', function (evt) {
    changeEffect(evt.target.defaultValue);
    window.uploadPhoto.uploadPreview.style.filter = tuneEffect(MAX_EFFECT_VALUE);
    levelValue.value = MAX_EFFECT_VALUE;
    levelPin.style.left = '100%';
    levelDepth.style.width = '100%';
  }, true);

  sizeValue.value = window.effects.currentScaleValue + '%';

  var getResizeValue = function (transformValue, controlValue) {
    window.uploadPhoto.uploadPreview.style.transform = 'scale(' + transformValue + ')';
    sizeValue.value = controlValue + '%';
  };

  var reducePreviewSize = function (step) {
    if (window.effects.currentScaleValue > step) {
      window.effects.currentScaleValue -= step;
      window.effects.currentTransformScale -= step / 100;
    }
  };

  var increasePreviewSize = function (step) {
    if (window.effects.currentScaleValue + step <= MAX_RESIZE_VALUE) {
      window.effects.currentScaleValue += step;
      window.effects.currentTransformScale += step / 100;
    }
  };

  resizeSmaller.addEventListener('click', function () {
    reducePreviewSize(RESIZE_STEP);
    getResizeValue(window.effects.currentTransformScale, window.effects.currentScaleValue);
  });

  resizeBigger.addEventListener('click', function () {
    increasePreviewSize(RESIZE_STEP);
    getResizeValue(window.effects.currentTransformScale, window.effects.currentScaleValue);
  });

})();
