'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var keyCode = {
    ESC: 27,
    ENTER: 13
  };

  var uploadFile = document.querySelector('#upload-file');
  var uploadOverlay = document.querySelector('.img-upload__overlay');
  var uploadOverlayClose = document.querySelector('#upload-cancel');
  var textDescription = document.querySelector('.text__description');

  window.uploadPhoto = {
    resetAllFormFilters: function () {

      window.effects.uploadPreview.style = '';
      window.effects.uploadPreviewImg.style = '';
      window.effects.uploadPreview.removeAttribute('class');
      window.effects.levelValue.removeAttribute('value');
      window.effects.sizeValue.value = '100%';
      window.effects.effectNone.checked = true;
      window.effects.uploadPreviewImg.src = 'img/upload-default-image.jpg'; // Возвращает превью в значение по умолчанию
    },

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
      window.uploadPhoto.resetAllFormFilters();
    },

    overlayCloseHandler: function () {
      document.body.removeAttribute('class');
      uploadOverlay.classList.add('hidden');
      uploadFile.value = '';
      window.uploadPhoto.resetAllFormFilters();
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

  uploadFile.addEventListener('change', function () {
    var file = uploadFile.files[0];
    var fileName = file.name.toLowerCase();
    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        window.effects.uploadPreview.src = reader.result;
      });
      reader.readAsDataURL(file);
    }
  });

  window.uploadPhoto.uploadOverlay = uploadOverlay;

})();
