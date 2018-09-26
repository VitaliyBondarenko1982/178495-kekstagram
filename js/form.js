'use strict';

(function () {
  var textHashtags = document.querySelector('.text__hashtags');

  textHashtags.addEventListener('blur', function () {
    var hashtagArray = textHashtags.value.split(' ');
    var duplicatesCounter = 0;
    textHashtags.setCustomValidity('');
    for (var i = 0; i < hashtagArray.length; i++) {
    // Если в элементе массива '#' встречается больше 1 раза - кидаем CustomValidity
      if (hashtagArray[i].split('#').length - 1 > 1) {
        textHashtags.setCustomValidity('Хеш-теги должны разделяться пробелами');
      }

      if (hashtagArray[i].slice(-1) === '#' || hashtagArray[i].slice(-1) === ',' || hashtagArray[i].slice(-1) === '.' || hashtagArray[i].slice(-1) === '/') {
        textHashtags.setCustomValidity('Хеш-тег не может оканчиваться на #, слэш, точку или запятую');
      }

      // Не начинается с '#' ?
      if (hashtagArray[i] !== '' && hashtagArray[i].slice(0, 1) !== '#') {
        textHashtags.setCustomValidity('Хеш-тег должен начинаться со знака #');
      }

      if (hashtagArray[i].length > 20) {
        textHashtags.setCustomValidity('Длина хеш-тега не может превышать 20 символов');
      }

      // Переводим все элементы в верхний регистр и сравниваем исходный массив с самим собой. Если совпадений больше, чем длинна массива - кидаем CustomValidity
      for (var j = 0; j < hashtagArray.length; j++) {
        if (hashtagArray[i].toUpperCase() === hashtagArray[j].toUpperCase()) {
          duplicatesCounter++;
        }
        if (duplicatesCounter > hashtagArray.length) {
          textHashtags.setCustomValidity('Хеш-теги не должны повторяться');
        }
      }
      // Чистим массив елементов от пустот
      while (hashtagArray[i] === '' || hashtagArray[i] === ' ') {
        hashtagArray.splice(i, 1);
      }

      if (hashtagArray[i] === '#') {
        textHashtags.setCustomValidity('Хеш-тег не может состоять из одного символа #');
      }
    }

    if (hashtagArray.length > 5) {
      textHashtags.setCustomValidity('Хеш-тегов не может быть более 5');
    }

    textHashtags.value = hashtagArray.join(' ');
  });

  window.form = {
    textHashtags: textHashtags
  };
})();
