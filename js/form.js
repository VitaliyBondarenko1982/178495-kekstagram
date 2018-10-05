'use strict';

(function () {
  var textHashtags = document.querySelector('.text__hashtags');
  var formSubmitBtn = document.querySelector('#upload-submit');
  var uploadForm = document.querySelector('.img-upload__form');

  formSubmitBtn.addEventListener('click', function () {
    var hashtagArray = textHashtags.value.split(' ');
    var duplicatesCounter = 0;
    textHashtags.setCustomValidity('');

    for (var i = 0; i < hashtagArray.length; i++) {
      if (hashtagArray[i].split('#').length - 1 > 1) {
        textHashtags.setCustomValidity('Хеш-теги должны разделяться пробелами');
      }

      if (hashtagArray[i].slice(-1) === '#' || hashtagArray[i].slice(-1) === ',' || hashtagArray[i].slice(-1) === '.' || hashtagArray[i].slice(-1) === '/') {
        textHashtags.setCustomValidity('Хеш-тег не может оканчиваться на #, слэш, точку или запятую');
      }

      if (hashtagArray[i] !== '' && hashtagArray[i].slice(0, 1) !== '#') {
        textHashtags.setCustomValidity('Хеш-тег должен начинаться со знака #');
      }

      if (hashtagArray[i].length > 20) {
        textHashtags.setCustomValidity('Длина хеш-тега не может превышать 20 символов');
      }

      for (var j = 0; j < hashtagArray.length; j++) {
        if (hashtagArray[i].toUpperCase() === hashtagArray[j].toUpperCase()) {
          duplicatesCounter++;
        }
        if (duplicatesCounter > hashtagArray.length) {
          textHashtags.setCustomValidity('Хеш-теги не должны повторяться');
        }
      }

      while (hashtagArray[i] === '' || hashtagArray[i] === ' ') {
        hashtagArray.splice(i, 1);
      }

      if (hashtagArray[i] === '#') {
        textHashtags.setCustomValidity('Хеш-тег не может состоять из одного символа #');
      }
    }

    if (hashtagArray.length > 5) {
      textHashtags.setCustomValidity('Хеш-тегов не может быть более 5');
    }

    textHashtags.value = hashtagArray.join(' ');
  });


  uploadForm.addEventListener('submit', function (evt) {
    evt.preventDefault();

    window.backend.uploadData(new FormData(uploadForm), function () {
      window.uploadPhoto.uploadOverlay.classList.add('hidden');
      uploadForm.reset();
      window.backend.displayXhrStatus('Форма отправлена успешно');
    }, window.backend.displayXhrStatus);
  });

  window.form = {
    uploadForm: uploadForm,
    textHashtags: textHashtags,
  };

})();
