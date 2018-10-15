'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png', 'ico', 'svg', 'webp'];

  var uploadFile = document.querySelector('#upload-file');
  var uploadPreview = document.querySelector('.img-upload__preview');
  var uploadPreviewImg = uploadPreview.querySelector('img');

  uploadFile.addEventListener('change', function () {

    var file = uploadFile.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        uploadPreviewImg.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  });

  window.uploadPhoto = {
    uploadPreview: uploadPreview,
    uploadPreviewImg: uploadPreviewImg,
    uploadFile: uploadFile
  };

})();
