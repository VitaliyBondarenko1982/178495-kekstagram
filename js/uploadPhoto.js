'use strict';

(function () {
  var keyCode = {
    ESC: 27,
    ENTER: 13
  };

  var uploadFile = document.querySelector('#upload-file');
  var uploadOverlay = document.querySelector('.img-upload__overlay');
  var uploadOverlayClose = document.querySelector('#upload-cancel');
  var textDescription = document.querySelector('.text__description');

  window.uploadPhoto = {
    overlayEscPressHandler: function (evt) {
      if (evt.keyCode === keyCode.ESC && document.activeElement !== window.form.textHashtags && document.activeElement !== textDescription) {
        window.uploadPhoto.overlayCloseHandler();
        window.preview.bigPicture.classList.add('hidden');
      }
    },

    overlayOpenHandler: function () {
      uploadOverlay.classList.remove('hidden');
      window.effects.effectLevel.classList.add('hidden');
      document.addEventListener('keydown', window.uploadPhoto.overlayEscPressHandler);
    },

    overlayCloseHandler: function () {
      // При закрытии модального окна возвращает все поля формы и значения фильтра в исходное положение
      uploadOverlay.classList.add('hidden');

      // Обнуляет все изменения при закрытии модального окна
      uploadFile.value = '';
      window.effects.uploadPreview.removeAttribute('style');
      window.effects.uploadPreview.removeAttribute('class');
      window.effects.levelValue.removeAttribute('value');
      window.effects.uploadPreview.querySelector('img').removeAttribute('style');
      window.effects.sizeValue.value = 100 + '%';
      window.effects.effectNone.selected = true;
      document.removeEventListener('keydown', window.uploadPhoto.overlayEscPressHandler);
    }
  };

  uploadFile.addEventListener('change', window.uploadPhoto.overlayOpenHandler);

  uploadOverlayClose.addEventListener('click', window.uploadPhoto.overlayCloseHandler);
  uploadOverlayClose.addEventListener('keydown', function (evt) {
    if (evt.keyCode === keyCode.ENTER) {
      window.uploadPhoto.overlayCloseHandler();
    }
  });

  window.uploadPhoto.uploadOverlay = uploadOverlay;

})();
