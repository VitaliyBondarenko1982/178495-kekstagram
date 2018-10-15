'use strict';

(function () {
  window.backend = {
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

      xhr.timeout = 10000;
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
        }
      });

      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });

      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.timeout = 5000;
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

  window.displayXhrStatus = function (message) {
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
