'use strict';

(function () {
  // Если при отправке данных произошла ошибка запроса = показать блок. ТЗ 3.4
  var onPostRequestError = function () {
    var errorNode = document.querySelector('.error');
    var tryAgainLink = errorNode.firstElementChild.firstElementChild;
    var uploadAgainLink = errorNode.firstElementChild.lastElementChild;
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
    getRequest: function (onLoad, onError) {
      var URL = 'https://js.dump.academy/kekstagram/data';
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.addEventListener('load', function () {
        var message;
        switch (xhr.status) {
          case 200:
            message = 'Данные загружены успешно';
            onLoad(xhr.response);
            break;
          case 400:
            message = 'Неверный запрос';
            break;
          case 401:
            message = 'Пользователь не авторизован';
            break;
          case 404:
            message = 'Страница не найдена';
            break;
          default:
            onError(xhr.status + ': ' + xhr.statusText);
        }
        onError(message);
      });
      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения, попробуйте обновить страницу');
      });
      xhr.addEventListener('timeout', function () {
        onError('Время ожидания соединения истекло');
      });
      xhr.timeout = 10000; // 10сек
      xhr.open('GET', URL);
      xhr.send();
    },
    // Функция отправки данных
    postRequest: function (data, onLoad, onError) {
      var URL = 'https://js.dump.academy/kekstagram';
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.addEventListener('load', function () {
        var message;
        switch (xhr.status) {
          case 200:
            message = 'Форма отправлена успешно';
            onLoad();
            break;
          case 400:
            message = 'Неверный запрос';
            onPostRequestError();
            break;
          case 401:
            message = 'Пользователь не авторизован';
            onPostRequestError();
            break;
          case 404:
            message = 'Страница не найдена';
            onPostRequestError();
            break;
          default:
            message = 'Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText;
            onPostRequestError();
        }
        onError(message);
      });
      xhr.addEventListener('error', function () {
        onError('Запрос не выполнен. Попробуйте обновить страницу и повторить запрос');
        onPostRequestError();
      });
      xhr.addEventListener('timeout', function () {
        onError('Время ожидания соединения исктекло.');
        onPostRequestError();
      });
      xhr.timeout = 10000; // 10сек
      xhr.open('POST', URL);
      xhr.send(data);
    },
  };
})();
