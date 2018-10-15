'use strict';

(function () {
  window.utils = {
    keyCode: {
      ESC: 27,
      ENTER: 13
    },

    // Возвращает случайное число из заданого интервала
    getRandomNumber: function (min, max) {
      return Math.round(Math.random() * (max - min) + min);
    },

    // Функция создания массива уникальных чисел
    getUniqueArray: function (min, max) {
      var myArray = [];

      for (var j = 0; myArray.length < max; j++) {
        var randomNumber = window.utils.getRandomNumber(min, max);
        var found = false;
        for (var i = 0; i < myArray.length; i++) {
          if (myArray[i] === randomNumber) {
            found = true;
            break;
          }
        }
        if (!found) {
          myArray[myArray.length] = randomNumber;
        }
      }
      return myArray.slice(0, 10);
    },

    // Функция очистки галереи
    clearGallery: function (className, container) {
      var picturesToRemove = document.querySelectorAll(className);
      picturesToRemove.forEach(function (item) {
        container.removeChild(item);
      });
    }
  };
})();
