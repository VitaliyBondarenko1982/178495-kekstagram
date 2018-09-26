'use strict';

(function () {
  var bigPicture = document.querySelector('.big-picture');
  var bigPictureClose = window.effects.effectLevel.querySelector('.big-picture__cancel');
  var showBigPictureWithData = function (arrElem) {
    bigPicture.classList.remove('hidden');

    bigPicture.querySelector('.big-picture__img img').src = arrElem.url;
    bigPicture.querySelector('.likes-count').textContent = arrElem.likes;
    bigPicture.querySelector('.comments-count').textContent = arrElem.comments.length;

    var fragment = document.createDocumentFragment();
    for (var i = 0; i < arrElem.comments.length; i++) {
      var socialCommentsList = document.querySelector('.social__comments');
      var commentElem = document.querySelector('.social__comment').cloneNode();
      var commentUserPic = document.querySelector('.social__picture').cloneNode(true);
      var textElem = document.createTextNode(arrElem.comments[i]);
      commentUserPic.src = 'img/avatar-' + window.utils.getRandomNumber(1, 6) + '.svg';
      commentElem.appendChild(commentUserPic);
      commentElem.appendChild(textElem);
      fragment.appendChild(commentElem);
    }
    // Удаляет из разметки уже существующие комментарии
    while (socialCommentsList.firstChild) {
      socialCommentsList.removeChild(socialCommentsList.firstChild);
    }
    // И добавляет новые
    socialCommentsList.appendChild(fragment);
    // Скрывает ноды с количеством комментариев и спиннером
    document.querySelector('.social__comment-count').classList.add('visually-hidden');
    document.querySelector('.social__comments-loader').classList.add('visually-hidden');
  };

  var pictureClickHandler = function (evt) {
    if (evt.target.parentElement.className === 'picture') {
      var target = evt.target;
      for (var i = 0; i < window.gallery.allPhotosArr.length; i++) {
        if (target.getAttribute('src') === window.gallery.allPhotosArr[i].url) {
          showBigPictureWithData(window.gallery.allPhotosArr[i]);
        }
      }
      document.addEventListener('keydown', window.uploadPhoto.overlayEscPressHandler);
      bigPictureClose.addEventListener('click', function () {
        bigPicture.classList.add('hidden');
      });
    }
  };

  // Открывает большую картинку по клику на миниатюру, вешает обработчик закрытия
  window.gallery.picturesList.addEventListener('click', pictureClickHandler);

  window.bigPicture = {
    bigPicture: bigPicture
  };
})();
