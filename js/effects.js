'use strict';

(function () {
  var effectsList = document.querySelector('.effects__list');
  var uploadPreview = document.querySelector('.img-upload__preview');
  // Список переменных шкалы фильтра
  var effectLevel = document.querySelector('.img-upload__effect-level');
  var levelLine = effectLevel.querySelector('.effect-level__line');
  var levelPin = levelLine.querySelector('.effect-level__pin');
  var levelDepth = levelLine.querySelector('.effect-level__depth');
  var levelValue = effectLevel.querySelector('.effect-level__value');

  // Список переменных ноды изменения размеров
  var uploadSizeScale = document.querySelector('.img-upload__scale');
  var resizeSmaller = uploadSizeScale.querySelector('.scale__control--smaller');
  var resizeBigger = uploadSizeScale.querySelector('.scale__control--bigger');
  var sizeValue = uploadSizeScale.querySelector('.scale__control--value');

  // Список элементов-фильтров по ID
  var effectChrome = effectsList.querySelector('#effect-chrome');
  var effectSepia = effectsList.querySelector('#effect-sepia');
  var effectMarvin = effectsList.querySelector('#effect-marvin');
  var effectPhobos = effectsList.querySelector('#effect-phobos');
  var effectHeat = effectsList.querySelector('#effect-heat');
  var effectNone = effectsList.querySelector('#effect-none');

  var effectsClassNameMap = {
    chrome: 'effects__preview--chrome',
    sepia: 'effects__preview--sepia',
    marvin: 'effects__preview--marvin',
    phobos: 'effects__preview--phobos',
    heat: 'effects__preview--heat'
  };

  // Получает соотношение шкалы уровня к общей длине шкалы и подставляет это значение в подходящем формате в атрибут style
  var refreshEffectDepth = function () {
    var getEffectDepth = function () {
      return (levelDepth.offsetWidth / levelLine.offsetWidth).toFixed(2);
    };
    var depth = getEffectDepth();
    if (effectChrome.checked) {
      uploadPreview.style = 'filter: grayscale(' + depth + ');';
      levelValue.setAttribute('value', depth);
    }
    if (effectSepia.checked) {
      uploadPreview.style = 'filter: sepia(' + depth + ');';
      levelValue.setAttribute('value', depth);
    }
    if (effectMarvin.checked) {
      uploadPreview.style = 'filter: invert(' + depth * 100 + '%);';
      levelValue.setAttribute('value', depth * 100 + '%');
    }
    if (effectPhobos.checked) {
      uploadPreview.style = 'filter: blur(' + depth * 3 + 'px);';
      levelValue.setAttribute('value', (depth * 3).toFixed(2) + 'px');
    }
    if (effectHeat.checked) {
      uploadPreview.style = 'filter: brightness(' + depth * 3 + ');';
      levelValue.setAttribute('value', (depth * 3).toFixed(2));
    }
  };

  var filterChangeHandler = function (scaleIsHidden, effectClassNameAdd) {
    uploadPreview.removeAttribute('class');
    // Если шкала спрятана ( === выбран вариант без фильтра) - обнуляет фильтры превью и значение фильтра в форме
    if (scaleIsHidden) {
      effectLevel.classList.add('hidden');
      uploadPreview.removeAttribute('style');
      levelValue.removeAttribute('value');
    } else {
      effectLevel.classList.remove('hidden');
    }
    if (effectClassNameAdd) {
      uploadPreview.className = effectClassNameAdd;
    }

    // При переключении фильтров - увеличивает значение фильтра до 100% согласно ТЗ
    levelPin.style.left = levelLine.offsetWidth + 'px';
    levelDepth.style.width = '100%';

    refreshEffectDepth();
  };

  effectsList.addEventListener('click', function (evt) {
    switch (evt.target) {
      case effectChrome :
        filterChangeHandler(false, effectsClassNameMap.chrome);
        break;
      case effectSepia :
        filterChangeHandler(false, effectsClassNameMap.sepia);
        break;
      case effectMarvin :
        filterChangeHandler(false, effectsClassNameMap.marvin);
        break;
      case effectPhobos :
        filterChangeHandler(false, effectsClassNameMap.phobos);
        break;
      case effectHeat :
        filterChangeHandler(false, effectsClassNameMap.heat);
        break;
      default:
        filterChangeHandler(true);
        break;
    }
  });
  // Вешает обработчик обновления фильтра
  levelPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var xStartCoords = evt.clientX;
    var onMouseMove = function (moveEvt) {
      var shift = xStartCoords - moveEvt.clientX;
      xStartCoords = moveEvt.clientX;
      moveEvt.preventDefault();
      levelPin.style.left = (levelPin.offsetLeft - shift) + 'px';
      levelDepth.style.width = (levelPin.offsetLeft / levelLine.offsetWidth * 100) + '%';
      // Задаем пину и полосе точки экстремума
      if (levelPin.offsetLeft <= 0) {
        levelPin.style.left = '0px';
        levelDepth.style.width = '0%';
      }
      if (levelPin.offsetLeft >= levelLine.offsetWidth) {
        levelPin.style.left = levelLine.offsetWidth + 'px';
        levelDepth.style.width = '100%';
      }
      refreshEffectDepth();
    };

    // При отпускании мыши сбрасываем все обработчики фильтров
    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // Меняет размер изображения, записывает данные в инпут
  var changeImgSize = function (scaleDown, scaleUp) {
    var img = uploadPreview.querySelector('img');
    var inputValue = parseInt(sizeValue.value, 10);
    var maxValue = 100;
    var minValue = 25;
    var step = 25;
    if (scaleDown) {
      if (inputValue > minValue) {
        img.style.transform = 'scale(0.' + (inputValue - step) + ')';
        sizeValue.value = inputValue - step + '%';
      }
    }
    if (scaleUp) {
      if (inputValue < maxValue) {
        img.style.transform = 'scale(0.' + (inputValue + step) + ')';
        sizeValue.value = inputValue + step + '%';
        if (parseInt(sizeValue.value, 10) === maxValue) {
          img.removeAttribute('style');
          sizeValue.value = maxValue + '%';
        }
      }
    }
  };

  uploadSizeScale.addEventListener('click', function (evt) {
    switch (evt.target) {
      case resizeSmaller:
        changeImgSize(true);
        break;
      case resizeBigger:
        changeImgSize(false, true);
        break;
    }
  });

  window.effects = {
    effectNone: effectNone,
    effectLevel: effectLevel,
    uploadPreview: uploadPreview,
    levelValue: levelValue,
    sizeValue: sizeValue
  };
})();
