'use strict';

(function () {
  // Подставляет данные из массива объектов в фрагменты и встраивает их на страницу

  var renderPhotoCards = function (arr) {
    var photoTemplateNode = document.querySelector('#picture').content.querySelector('.picture');

    var fragment = document.createDocumentFragment();
    for (var i = 0; i < arr.length; i++) {
      var photoElement = photoTemplateNode.cloneNode(true);
      photoElement.querySelector('.picture__img').src = arr[i].url;
      photoElement.querySelector('.picture__comments').textContent = arr[i].comments.length - 1;
      photoElement.querySelector('.picture__likes').textContent = arr[i].likes;
      fragment.appendChild(photoElement);
    }
    document.querySelector('.pictures').appendChild(fragment);
  };

  // renderPhotoCards(window.gallery.allPhotosArr);

  // window.picture.renderPhotoCards = renderPhotoCards;
  var onDataGetSuccess = function (data) {
    window.gallery.allPhotosArr = data;
    renderPhotoCards(data);
  };

  window.backend.getRequest(onDataGetSuccess, window.form.displayXhrStatus);
  window.gallery = {};

})();
