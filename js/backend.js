'use strict';

(function () {
  // Если при отправке данных произошла ошибка запроса = показать блок ТЗ 3.4
  var onPostRequestError = function () {
    var errorNode = document.querySelector('.error');
    var errorButtons = document.querySelector('.error__buttons');
    var tryAgainLink = errorButtons.firstElementChild;
    var uploadAgainLink = errorButtons.lastElementChild;
    var imgUploadInput = document.querySelector('.img-upload__input');

    window.uploadPhoto.uploadOverlay.classList.add('hidden');
    window.uploadPhoto.resetAllFormFilters();
    errorNode.classList.remove('hidden');
    tryAgainLink.addEventListener('click', function () {
      errorNode.classList.add('hidden');
      window.form.uploadForm.reset();
    });
    uploadAgainLink.addEventListener('click', function () {
      errorNode.classList.add('hidden');
      window.form.uploadForm.reset();
      imgUploadInput.click();
    });
  };

  window.backend = {
    // Функция получения данных
    loadData: function (onLoad, onError) {
      var URL = 'https://js.dump.academy/kekstagram/data';
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          onLoad(xhr.response);
        } else {
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });

      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });

      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.timeout = 10000; // 10сек
      xhr.open('GET', URL);
      xhr.send();
    },

    uploadData: function (data, onLoad, onError) {
      var URL = 'https://js.dump.academy/kekstagram';
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          onLoad(xhr.response);
        } else {
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
          onPostRequestError();
        }
      });

      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
        onPostRequestError();
      });

      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
        onPostRequestError();
      });

      xhr.timeout = 5000; // 10сек
      xhr.open('POST', URL);
      xhr.send(data);
    },
  };

  var errorElement = document.createElement('div');
  var hideErrorMessage = function () {
    setTimeout(function () {
      errorElement.classList.add('hidden');
    }, 5000);
  };

  window.backend.displayXhrStatus = function (message) {
    var dataGetSuccess = 'Данные загружены успешно';
    var formPostSuccess = 'Форма отправлена успешно';

    errorElement.style.position = 'fixed';
    errorElement.style.top = '60px';
    errorElement.style.width = '100%';
    errorElement.style.padding = '20px';

    errorElement.style.backgroundColor = 'rgba(225, 0, 0, 0.55)'; // Полупрозрачный красный
    errorElement.style.outline = '2px solid rgba(255, 0, 0, 0.7)';
    errorElement.style.textAlign = 'center';
    errorElement.style.zIndex = '100';
    errorElement.textContent = 'ERROR! ' + message;
    errorElement.id = 'serverStatus';
    if (message === dataGetSuccess || message === formPostSuccess) {

      errorElement.style.backgroundColor = 'rgba(0, 128, 0, 0.55)'; // Полупрозрачный зеленый
      errorElement.style.outline = '2px solid rgba(0, 128, 0, 0.7)';
      errorElement.textContent = message;
    }
    document.body.insertAdjacentElement('afterbegin', errorElement);
    hideErrorMessage();
  };
})();
