'use strict';

(function () {
  var photoData = {
    photosCount: 25,
    likesMax: 200,
    likesMin: 15,
    comments: ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'],
    descriptions: ['Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят', 'Отдыхаем...', 'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......', 'Вот это тачка!']
  };

  // Генерирует массив дата-объектов из случайных данных
  var generatePhotoCardsDataArray = function (dataObj) {
    var photosArr = [];

    for (var i = 1; i <= dataObj.photosCount; i++) {
      var shuffledComments = window.utils.getShuffledArray(dataObj.comments);
      var photoCard = {
        url: 'photos/' + i + '.jpg',
        likes: window.utils.getRandomNumber(dataObj.likesMin, dataObj.likesMax),
        comments: window.utils.getRandomNumber(0, 2) ? shuffledComments.slice(0, 2) : shuffledComments.slice(0, 3),
        description: dataObj.descriptions[window.utils.getRandomNumber(0, dataObj.descriptions.length - 1)]
      };
      photosArr.push(photoCard);
    }
    return photosArr;
  };

  var allPhotosArr = generatePhotoCardsDataArray(photoData);
  var picturesList = document.querySelector('.pictures');

  window.gallery = {
    picturesList: picturesList,
    allPhotosArr: allPhotosArr
  };

})();
