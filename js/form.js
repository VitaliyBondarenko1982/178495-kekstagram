'use strict';

(function () {
  var validationCriteriaMap = {
    MAX_STRING_LENGTH: 20,
    MAX_HASHTAGS_AMOUNT: 5,
    BAD_ENDS: ['#', ',', '.', '/']
  };

  var uploadOverlay = document.querySelector('.img-upload__overlay');
  var textHashtags = document.querySelector('.text__hashtags');
  var uploadForm = document.querySelector('.img-upload__form');
  var uploadOverlayClose = document.querySelector('#upload-cancel');
  var textDescription = document.querySelector('.text__description');

  var validateHashtags = function () {
    var hashtagArray = textHashtags.value.split(' ');
    var duplicatesCounter = 0;
    textHashtags.setCustomValidity('');

    hashtagArray.forEach(function (currentItem, index, currentArray) {
      var badStringEnding = validationCriteriaMap.BAD_ENDS.some(function (el) {
        return currentItem.endsWith(el);
      });

      if (currentItem.split('#').length - 1 > 1) {
        textHashtags.setCustomValidity('Хеш-теги должны разделяться пробелами');
      }

      if (badStringEnding) {
        textHashtags.setCustomValidity('Хеш-тег не может оканчиваться на #, слэш, точку или запятую');
      }

      if (currentItem !== '' && currentItem.slice(0, 1) !== '#') {
        textHashtags.setCustomValidity('Хеш-тег должен начинаться со знака #');
      }

      if (currentItem.length > validationCriteriaMap.MAX_STRING_LENGTH) {
        textHashtags.setCustomValidity('Длина хеш-тега не может превышать ' + validationCriteriaMap.MAX_STRING_LENGTH + ' символов');
      }

      if (currentItem === '' && currentArray[index + 1] === '') {
        currentArray.splice(index, 1);
      }

      if (currentArray[validationCriteriaMap.MAX_HASHTAGS_AMOUNT] === '') {
        currentArray.splice(currentArray.indexOf(''), 1);// Хеш-тегов не может быть более 5
      }

      if (currentArray.length > validationCriteriaMap.MAX_HASHTAGS_AMOUNT) {
        textHashtags.setCustomValidity('Хеш-тегов не может быть более ' + validationCriteriaMap.MAX_HASHTAGS_AMOUNT);
      }

      currentArray.forEach(function (el) {
        if (currentItem.toUpperCase() === el.toUpperCase()) {
          duplicatesCounter++;
        }
      });

      if (duplicatesCounter > currentArray.length) {
        textHashtags.setCustomValidity('Хеш-теги не должны повторяться');
      }
      if (currentItem === '#') {
        textHashtags.setCustomValidity('Хеш-тег не может состоять из одного символа #');
      }
    });

    textHashtags.value = hashtagArray.join(' ');
  };

  textHashtags.addEventListener('input', validateHashtags);

  var overlayEscHandler = function (evt) {
    if (evt.keyCode === window.utils.keyCode.ESC && window.uploadPhoto.uploadSection !== document.activeElement && textHashtags !== document.activeElement) {
      hideOverlay();
    }
  };

  var fileChangeHandler = function () {
    uploadOverlay.classList.remove('hidden');
    window.effects.effectLevel.classList.add('hidden');
    document.addEventListener('keydown', overlayEscHandler);
    window.effects.sizeValue.value = window.effects.MAX_RESIZE_VALUE + '%';
  };

  var hideOverlay = function () {
    uploadOverlay.classList.add('hidden');
    window.uploadPhoto.uploadFile.value = null;
    document.removeEventListener('keydown', overlayEscHandler);
    textHashtags.value = '';
    textDescription.value = '';
    window.uploadPhoto.uploadPreview.style.filter = 'none';
    window.uploadPhoto.uploadPreview.style.transform = 'scale(1)';
    window.effects.currentTransformScale = 1;
    window.effects.currentScaleValue = window.effects.MAX_SCALE_VALUE;
  };

  window.uploadPhoto.uploadFile.addEventListener('change', fileChangeHandler);
  uploadOverlayClose.addEventListener('click', function () {
    hideOverlay();
  });

  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');

  var renderSuccess = function () {
    var successNode = successTemplate.cloneNode(true);
    return successNode;
  };

  var renderError = function (message) {
    var errorNode = errorTemplate.cloneNode(true);
    errorNode.querySelector('.error__title').textContent = 'Ошибка загрузки файла. ' + message;
    return errorNode;
  };

  var showStatus = function (currentStatus) {
    var fragment = document.createDocumentFragment();
    var messageContainer = document.querySelector('main');
    fragment.appendChild(currentStatus);
    messageContainer.appendChild(fragment);
  };

  var setKeydownListener = function (statusNode) {
    var messageEscHandler = function (evt) {
      if (evt.keyCode === window.utils.keyCode.ESC) {
        statusNode.remove();
      }
      document.removeEventListener('keydown', messageEscHandler);
    };
    document.addEventListener('keydown', messageEscHandler);
  };

  var successUploadHandler = function () {
    hideOverlay();
    showStatus(renderSuccess());
    var successNode = document.querySelector('.success');
    var successButton = successNode.querySelector('.success__button');
    successButton.addEventListener('click', function () {
      successNode.remove();
    });
    window.addEventListener('click', function () {
      successNode.remove();
    });
    setKeydownListener(successNode);
  };

  var errorUploadHandler = function (message) {
    hideOverlay();
    showStatus(renderError(message));
    var errorNode = document.querySelector('.error');
    var errorButtons = errorNode.querySelectorAll('.error__button');
    errorButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        window.util.deleteElement(errorNode);
      });
    });
    window.addEventListener('click', function () {
      errorNode.remove();
    });
    setKeydownListener(errorNode);
  };

  uploadForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.uploadData(new FormData(uploadForm), successUploadHandler, errorUploadHandler);
  });

  window.form = {
    uploadForm: uploadForm,
    textHashtags: textHashtags
  };
})();
