'use strict';

(function () {
  var MAX_COMMENTS = 5;

  var bigPicture = document.querySelector('.big-picture');
  var bigPictureClose = document.querySelector('.big-picture__cancel');
  var socialComments = bigPicture.querySelector('.social__comments');
  var picturesList = document.querySelector('.pictures');
  var commentsLoader = bigPicture.querySelector('.social__comments-loader');

  var counter = {
    nextComments: MAX_COMMENTS,
    addComments: function () {
      this.nextComments += MAX_COMMENTS;
    },
    resetComments: function () {
      this.nextComments = MAX_COMMENTS;
    }
  };

  var createElements = function (container, renderFunction, elementsArray) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < elementsArray.length; i++) {
      fragment.appendChild(renderFunction(elementsArray[i]));
    }
    container.appendChild(fragment);
  };

  var renderSocialComment = function (comment) {
    var commentTemplate = document.querySelector('#socialComment').content.querySelector('li');
    var commentElement = commentTemplate.cloneNode(true);
    commentElement.querySelector('img').src = 'img/avatar-' + window.utils.getRandomNumber(1, 6) + '.svg';
    commentElement.querySelector('p').textContent = comment;
    return commentElement;
  };

  var showBigPictureWithData = function (arrElem) {
    var calculateCommentsNumber = function () {
      return arrElem.comments.length;
    };

    bigPicture.classList.remove('hidden');
    bigPicture.querySelector('.social__caption').textContent = arrElem.comments[0];
    bigPicture.querySelector('.big-picture__img img').src = arrElem.url;
    bigPicture.querySelector('.likes-count').textContent = arrElem.likes;
    bigPicture.querySelector('.comments-count').textContent = calculateCommentsNumber(arrElem);
    var displayedCommentsCounter = bigPicture.querySelector('.display-comments-count');
    displayedCommentsCounter.textContent = (arrElem.comments.length < MAX_COMMENTS) ? arrElem.comments.length : MAX_COMMENTS;
    createElements(socialComments, renderSocialComment, arrElem.comments.slice(0, 3));

    var loaderClickHandler = function () {
      createElements(socialComments, renderSocialComment, arrElem.comments.slice(counter.nextComments, counter.nextComments + MAX_COMMENTS));
      displayedCommentsCounter.textContent = parseInt(displayedCommentsCounter.textContent, 10) + MAX_COMMENTS;

      if (displayedCommentsCounter.textContent > arrElem.comments.length) {
        displayedCommentsCounter.textContent = arrElem.comments.length;
      }

      if (counter.nextComments + MAX_COMMENTS >= arrElem.comments.length) {
        commentsLoader.classList.add('hidden');
      }

      counter.addComments();
    };

    if (arrElem.comments.length <= 5) {
      commentsLoader.classList.add('hidden');
    } else {
      commentsLoader.classList.remove('hidden');
      commentsLoader.addEventListener('click', loaderClickHandler);
    }

  };

  var bigPhotoCloseHandler = function (evt) {
    if (evt.keyCode === window.utils.keyCode.ESC) {
      window.preview.bigPicture.classList.add('hidden');
    }
  };

  var onPictureMiniatureEvent = function (evt, isKeydownDown) {
    window.gallery.allPhotosArr.forEach(function (el) {
      if (isKeydownDown) {
        if (evt.target.querySelector('img').getAttribute('src') === el.url) {
          showBigPictureWithData(el);
        }
      }
      if (evt.target.getAttribute('src') === el.url) {
        showBigPictureWithData(el);
      }
    });
    document.addEventListener('keydown', bigPhotoCloseHandler);

    document.body.classList.add('modal-open');
    bigPictureClose.addEventListener('click', function () {
      document.body.classList.remove('modal-open');
      bigPicture.classList.add('hidden');
    });
  };

  picturesList.addEventListener('click', function (evt) {
    if (evt.target.className === 'picture__img') {
      onPictureMiniatureEvent(evt);
    }
  });
  picturesList.addEventListener('keydown', function (evt) {
    if (evt.target.className === 'picture' && evt.keyCode === window.utils.keyCode.ENTER) {
      onPictureMiniatureEvent(evt, true);
    }
  });

  window.preview = {
    showBigPictureWithData: showBigPictureWithData,
    bigPicture: bigPicture,
    picturesList: picturesList
  };

})();
