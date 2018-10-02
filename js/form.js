'use strict';

(function () {
  var textHashtags = document.querySelector('.text__hashtags');
  var formSubmitBtn = document.querySelector('#upload-submit');
  var uploadForm = document.querySelector('.img-upload__form');

  formSubmitBtn.addEventListener('click', function () {
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

  // var form = document.querySelector('.img-upload__form');

  // Отменяет действие формы по умолчанию и отправляет форму посредством XHR на сервер
  uploadForm.addEventListener('submit', function (evt) {
    evt.preventDefault();

    window.backend.postRequest(new FormData(uploadForm), function () {
      window.uploadPhoto.uploadOverlay.classList.add('hidden');
      uploadForm.reset();
    }, displayXhrStatus);
  });

  // Отрисовка окна со статусом xhr запроса
  var displayXhrStatus = function (message) {
    var dataGetSuccess = 'Данные загружены успешно';
    var formPostSuccess = 'Форма отправлена успешно';

    var errorNode = document.createElement('div');
    errorNode.style.position = 'fixed';
    errorNode.style.top = '60px';
    errorNode.style.width = '100%';
    errorNode.style.padding = '20px';

    errorNode.style.backgroundColor = 'rgba(225, 0, 0, 0.55)'; // Полупрозрачный красный
    errorNode.style.outline = '2px solid rgba(255, 0, 0, 0.7)';
    errorNode.style.textAlign = 'center';
    errorNode.style.zIndex = '100';
    errorNode.textContent = 'Эррор! ' + message;
    errorNode.id = 'serverStatus';
    if (message === dataGetSuccess || message === formPostSuccess) {

      errorNode.style.backgroundColor = 'rgba(0, 128, 0, 0.55)'; // Полупрозрачный зеленый
      errorNode.style.outline = '2px solid rgba(0, 128, 0, 0.7)';
      errorNode.textContent = message;
    }
    document.body.insertAdjacentElement('afterbegin', errorNode);

    // Плавно снижает прозрачность статусного дива. Если прозрачность <= 0 > удаляет блок статуса
    setTimeout(function () {
      var statusNode = document.querySelector('#serverStatus');
      var statStyle = statusNode.style;
      statStyle.opacity = 1;
      (function fade() {
        if (statStyle.opacity > 0) {
          statStyle.opacity -= 0.1;
        }
        if (statStyle.opacity <= 0) {
          statusNode.remove();
        } else {
          setTimeout(fade, 45);
        }
      })();
    }, 3000); // Сообщение висит 3 секунды
  };

  window.form = {
    uploadForm: uploadForm,
    textHashtags: textHashtags,
    displayXhrStatus: displayXhrStatus
  };

})();
