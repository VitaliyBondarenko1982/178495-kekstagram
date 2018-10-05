'use strict';

(function () {
  var bigPicture = document.querySelector('.big-picture');
  var bigPictureClose = document.querySelector('.big-picture__cancel');
  var picturesList = document.querySelector('.pictures');

  var showBigPictureWithData = function (arrElem) {
    bigPicture.classList.remove('hidden');

    bigPicture.querySelector('.social__caption').textContent = arrElem.comments[0];
    bigPicture.querySelector('.big-picture__img img').src = arrElem.url;
    bigPicture.querySelector('.likes-count').textContent = arrElem.likes;
    bigPicture.querySelector('.comments-count').textContent = arrElem.comments.length;

    var fragment = document.createDocumentFragment();
    for (var i = 0; i < arrElem.comments.length; i++) {
      var socialCommentsList = document.querySelector('.social__comments');
      var commentElem = document.querySelector('.social__comment').cloneNode();
      var commentUserPic = document.querySelector('.social__picture').cloneNode(true);
      var textElem = document.createTextNode(arrElem.comments[i]);

      commentElem.removeAttribute('style');
      commentUserPic.src = 'img/avatar-' + window.utils.getRandomNumber(1, 6) + '.svg';
      commentElem.appendChild(commentUserPic);
      commentElem.appendChild(textElem);
      fragment.appendChild(commentElem);
    }

    while (socialCommentsList.firstChild) {
      socialCommentsList.removeChild(socialCommentsList.firstChild);
    }

    socialCommentsList.appendChild(fragment);
    socialCommentsList.firstChild.style.display = 'none';

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

  picturesList.addEventListener('click', pictureClickHandler);

  window.preview = {
    bigPicture: bigPicture,
    picturesList: picturesList
  };
})();
