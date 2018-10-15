'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;
  var filterContainer = document.querySelector('.img-filters ');
  var picturesBlock = document.querySelector('.pictures');
  var filterButtons = filterContainer.querySelectorAll('.img-filters__button');
  var xhrPhotos;
  var lastTimeout;

  var removeOldPhotos = function () {
    var oldPhotos = picturesBlock.querySelectorAll('.picture');
    if (oldPhotos !== null) {
      [].forEach.call(oldPhotos, function (element) {
        picturesBlock.removeChild(element);
      });
    }
  };

  var renderPhotoCards = function (arr) {
    removeOldPhotos();
    var photoTemplateNode = document.querySelector('#picture').content.querySelector('.picture');

    var fragment = document.createDocumentFragment();
    arr.forEach(function (elem) {
      var photoElement = photoTemplateNode.cloneNode(true);
      photoElement.querySelector('img').src = elem.url;
      photoElement.querySelector('.picture__comments').textContent = elem.comments.length - 1;
      photoElement.querySelector('.picture__likes').textContent = elem.likes;
      fragment.appendChild(photoElement);
    });
    picturesBlock.appendChild(fragment);
  };

  function getRandomPictures(pictures) {
    var randomUniqueArray = window.utils.getUniqueArray(0, pictures.length);
    var randomPictures = [];
    randomUniqueArray.forEach(function (it) {
      return randomPictures.push(pictures[it]);
    });
    return randomPictures;
  }

  var sortButtonClickHandler = function (evt) {
    var activeElement = evt.target;
    filterContainer.querySelector('.img-filters__button--active').classList.remove('img-filters__button--active');
    activeElement.classList.add('img-filters__button--active');

    var photosCopy = xhrPhotos.slice();
    switch (activeElement.id) {
      case 'filter-popular':
        photosCopy = photosCopy.sort(function (first, second) {
          return second.likes - first.likes;
        });
        break;
      case 'filter-new':
        window.utils.clearGallery('.picture', picturesBlock);
        photosCopy = getRandomPictures(photosCopy);
        break;
      case 'filter-discussed':
        photosCopy = photosCopy.sort(function (first, second) {
          return second.comments.length - first.comments.length;
        });
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

    window.displayXhrStatus('Данные загружены успешно');
    renderPhotoCards(xhrPhotos);
    filterContainer.classList.remove('img-filters--inactive');
    [].forEach.call(filterButtons, function (button) {
      button.addEventListener('click', sortButtonClickHandler);
    });
  };

  window.backend.loadData(onDataGetSuccess, window.displayXhrStatus);
  window.gallery = {};

})();
