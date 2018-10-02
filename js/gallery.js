'use strict';

(function () {

  var filterContainer = document.querySelector('.img-filters ');
  filterContainer.classList.remove('img-filters--inactive');
  var filterButtons = filterContainer.querySelectorAll('.img-filters__button');
  var picturesBlock = document.querySelector('.pictures');
  var DEBOUNCE_INTERVAL = 500;
  var xhrPhotos;
  var lastTimeout;

  // Удаляет все текущие миниатюры перед отрисовкой отсортированных миниатюр
  var removeOldPhotos = function () {
    var oldPhotos = picturesBlock.querySelectorAll('.picture');
    if (oldPhotos !== null) {
      [].forEach.call(oldPhotos, function (element) {
        picturesBlock.removeChild(element);
      });
    }
  };

  // Подставляет данные из массива объектов в фрагменты и встраивает их на страницу
  var renderPhotoCards = function (arr) {
    removeOldPhotos();
    var photoTemplateNode = document.querySelector('#picture').content.querySelector('.picture');

    var fragment = document.createDocumentFragment();
    for (var i = 0; i < arr.length; i++) {
      var photoElement = photoTemplateNode.cloneNode(true);
      photoElement.querySelector('.picture__img').src = arr[i].url;
      photoElement.querySelector('.picture__comments').textContent = arr[i].comments.length - 1;
      photoElement.querySelector('.picture__likes').textContent = arr[i].likes;
      fragment.appendChild(photoElement);
    }
    picturesBlock.appendChild(fragment);
  };

  // Фильтрует миниатюры по клику на кнопку фильтра
  var sortButtonClickHandler = function (evt) {
    var activeElement = evt.target;
    filterContainer.querySelector('.img-filters__button--active').classList.remove('img-filters__button--active');
    activeElement.classList.add('img-filters__button--active');

    // Создаем копию массива для сортировки
    var photosCopy = xhrPhotos.slice();
    switch (activeElement.id) {
      case 'filter-popular':
        photosCopy = photosCopy.sort(function (first, second) {
          return second.likes - first.likes;
        });
        break;
      case 'filter-discussed':
        photosCopy = photosCopy.sort(function (first, second) {
          return second.comments.length - first.comments.length;
        });
        break;
      case 'filter-random':
        photosCopy = window.utils.getShuffledArray(photosCopy);
        break;
    }
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(function () {
      renderPhotoCards(photosCopy);
    }, DEBOUNCE_INTERVAL);
  };

  var onDataGetSuccess = function (data) {
    xhrPhotos = data;
    window.gallery.allPhotosArr = xhrPhotos;

    renderPhotoCards(xhrPhotos);
    filterContainer.classList.remove('img-filters--inactive');
    [].forEach.call(filterButtons, function (button) {
      button.addEventListener('click', sortButtonClickHandler);
    });
  };

  window.backend.getRequest(onDataGetSuccess, window.form.displayXhrStatus);
  window.gallery = {};

})();
