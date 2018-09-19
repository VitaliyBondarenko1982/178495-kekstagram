'use strict';

var photoData = {
  photosCount: 25,
  likesMax: 200,
  likesMin: 15,
  comments: [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ],
  descriptions: [
    'Тестим новую камеру!',
    'Затусили с друзьями на море',
    'Как же круто тут кормят',
    'Отдыхаем...',
    'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
    'Вот это тачка!'
  ]
};

// Возвращает случайное число из заданого интервала
var getRandomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

/* Возвращает перемешаный массив
 Тасование Фишера — Йетса      */
var getShuffledArray = function (arr) {
  var m = arr.length;
  while (m) {
    var i = Math.floor(Math.random() * m--);
    var t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }
  return arr;
};

// Генерирует массив дата-объектов из случайных данных
var generatePhotoCardsDataArray = function (dataObj) {
  var photosArr = [];

  for (var i = 1; i <= dataObj.photosCount; i++) {
    var shuffledComments = getShuffledArray(dataObj.comments);
    var photoCard = {
      url: 'photos/' + i + '.jpg',
      likes: getRandomNumber(dataObj.likesMin, dataObj.likesMax),
      comments: getRandomNumber(0, 2) ? shuffledComments.slice(0, 2) : shuffledComments.slice(0, 3),
      description: dataObj.descriptions[getRandomNumber(0, dataObj.descriptions.length - 1)]
    };
    photosArr.push(photoCard);
  }
  return photosArr;
};

var allPhotosArr = generatePhotoCardsDataArray(photoData);

// Подставляет данные из массива объектов в фрагменты и встраивает их на страницу
var picturesList = document.querySelector('.pictures');
var renderPhotoCards = function (arr) {
  var photoTemplateNode = document.querySelector('#picture').content.querySelector('.picture');

  var fragment = document.createDocumentFragment();
  for (var i = 0; i < arr.length; i++) {
    var photoElement = photoTemplateNode.cloneNode(true);
    photoElement.querySelector('.picture__img').src = arr[i].url;
    photoElement.querySelector('.picture__comments').textContent = arr[i].comments.length;
    photoElement.querySelector('.picture__likes').textContent = arr[i].likes;
    fragment.appendChild(photoElement);
  }
  picturesList.appendChild(fragment);
};

var bigPicture = document.querySelector('.big-picture');
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
    commentUserPic.src = 'img/avatar-' + getRandomNumber(1, 6) + '.svg';
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

renderPhotoCards(allPhotosArr);
// showBigPictureWithData(allPhotosArr[0]);

var keyCode = {
  ESC: 27,
  ENTER: 13
};

var uploadFile = document.querySelector('#upload-file');
var uploadOverlay = document.querySelector('.img-upload__overlay');
var uploadOverlayClose = document.querySelector('#upload-cancel');
var textHashtags = document.querySelector('.text__hashtags');
var textDescription = document.querySelector('.text__description');

var overlayEscPressHandler = function (evt) {
  if (evt.keyCode === keyCode.ESC && document.activeElement !== textHashtags && document.activeElement !== textDescription) {
    overlayCloseHandler();
    bigPicture.classList.add('hidden');
  }
};
var overlayOpenHandler = function () {
  uploadOverlay.classList.remove('hidden');
  effectLevel.classList.add('hidden');
  document.addEventListener('keydown', overlayEscPressHandler);
};

var overlayCloseHandler = function () {
  // При закрытии модального окна возвращает все поля формы и значения фильтра в исходное положение
  uploadOverlay.classList.add('hidden');

  // Обнуляет все изменения при закрытии модального окна
  uploadFile.value = '';
  uploadPreview.removeAttribute('style');
  uploadPreview.removeAttribute('class');
  levelValue.removeAttribute('value');
  uploadPreview.querySelector('img').removeAttribute('style');
  sizeValue.value = 100 + '%';
  effectNone.selected = true;
  document.removeEventListener('keydown', overlayEscPressHandler);
};

uploadFile.addEventListener('change', overlayOpenHandler);

uploadOverlayClose.addEventListener('click', overlayCloseHandler);
uploadOverlayClose.addEventListener('keydown', function (evt) {
  if (evt.keyCode === keyCode.ENTER) {
    overlayCloseHandler();
  }
});

var effectsList = document.querySelector('.effects__list');
var uploadPreview = document.querySelector('.img-upload__preview');
// Список переменных шкалы фильтра
var effectLevel = document.querySelector('.img-upload__effect-level');
var levelLine = effectLevel.querySelector('.effect-level__line');
var levelPin = levelLine.querySelector('.effect-level__pin');
var levelDepth = levelLine.querySelector('.effect-level__depth');
var levelValue = document.querySelector('.effect-level__value');
// Список переменных ноды изменения размеров
var uploadSizeScale = document.querySelector('.img-upload__scale');
var resizeSmaller = uploadSizeScale.querySelector('.scale__control--smaller');
var resizeBigger = uploadSizeScale.querySelector('.scale__control--bigger');
var sizeValue = uploadSizeScale.querySelector('.scale__control--value');

var bigPictureClose = document.querySelector('.big-picture__cancel');

document.querySelector('.img-upload__scale').style = 'z-index: 100';


// Список элементов-фильтров по ID
var effectChrome = effectsList.querySelector('#effect-chrome');
var effectSepia = effectsList.querySelector('#effect-sepia');
var effectMarvin = effectsList.querySelector('#effect-marvin');
var effectPhobos = effectsList.querySelector('#effect-phobos');
var effectHeat = effectsList.querySelector('#effect-heat');
var effectNone = effectsList.querySelector('#effect-none');

var effectsClassNameMap = {
  chrome: 'effects__preview--chrome',
  sepia: 'effects__preview--sepia',
  marvin: 'effects__preview--marvin',
  phobos: 'effects__preview--phobos',
  heat: 'effects__preview--heat'
};

// Получает соотношение шкалы уровня к общей длине шкалы и подставляет это значение в подходящем формате в атрибут style
var refreshEffectDepth = function () {
  var getEffectDepth = function () {
    return (levelDepth.offsetWidth / levelLine.offsetWidth).toFixed(2);
  };
  var depth = getEffectDepth();
  if (effectChrome.checked) {
    uploadPreview.style = 'filter: grayscale(' + depth + ');';
    levelValue.setAttribute('value', depth);
  }
  if (effectSepia.checked) {
    uploadPreview.style = 'filter: sepia(' + depth + ');';
    levelValue.setAttribute('value', depth);
  }
  if (effectMarvin.checked) {
    uploadPreview.style = 'filter: invert(' + depth * 100 + '%);';
    levelValue.setAttribute('value', depth * 100 + '%');
  }
  if (effectPhobos.checked) {
    uploadPreview.style = 'filter: blur(' + depth * 3 + 'px);';
    levelValue.setAttribute('value', (depth * 3).toFixed(2) + 'px');
  }
  if (effectHeat.checked) {
    uploadPreview.style = 'filter: brightness(' + depth * 3 + ');';
    levelValue.setAttribute('value', (depth * 3).toFixed(2));
  }
};

var filterChangeHandler = function (scaleIsHidden, filterClassNameAdd) {
  uploadPreview.removeAttribute('class');
  // Если шкала спрятана ( === выбран вариант без фильтра) - обнуляет фильтры превью и значение фильтра в форме
  if (scaleIsHidden) {
    effectLevel.classList.add('hidden');
    uploadPreview.removeAttribute('style');
    levelValue.removeAttribute('value');
  } else {
    effectLevel.classList.remove('hidden');
  }
  if (filterClassNameAdd) {
    uploadPreview.className = filterClassNameAdd;
  }
  refreshEffectDepth();
};

effectsList.addEventListener('click', function (evt) {
  switch (evt.target) {
    case effectChrome :
      filterChangeHandler(false, effectsClassNameMap.chrome);
      break;
    case effectSepia :
      filterChangeHandler(false, effectsClassNameMap.sepia);
      break;
    case effectMarvin :
      filterChangeHandler(false, effectsClassNameMap.marvin);
      break;
    case effectPhobos :
      filterChangeHandler(false, effectsClassNameMap.phobos);
      break;
    case effectHeat :
      filterChangeHandler(false, effectsClassNameMap.heat);
      break;
    default:
      filterChangeHandler(true);
      break;
  }
});

// Вешает обработчик отпускания клика на пин фильтра
levelPin.addEventListener('mouseup', refreshEffectDepth);

// Меняет размер изображения, записывает данные в инпут
var changeImgSize = function (scaleDown, scaleUp) {
  var img = uploadPreview.querySelector('img');
  var inputValue = parseInt(sizeValue.value, 10);
  var maxValue = 100;
  var minValue = 25;
  var step = 25;
  if (scaleDown) {
    if (inputValue > minValue) {
      img.style.transform = 'scale(0.' + (inputValue - step) + ')';
      sizeValue.value = inputValue - step + '%';
    }
  }
  if (scaleUp) {
    if (inputValue < maxValue) {
      img.style.transform = 'scale(0.' + (inputValue + step) + ')';
      sizeValue.value = inputValue + step + '%';
      if (parseInt(sizeValue.value, 10) === maxValue) {
        img.removeAttribute('style');
        sizeValue.value = maxValue + '%';
      }
    }
  }
};

uploadSizeScale.addEventListener('click', function (evt) {
  switch (evt.target) {
    case resizeSmaller:
      changeImgSize(true);
      break;
    case resizeBigger:
      changeImgSize(false, true);
      break;
  }
});


var pictureClickHandler = function (evt) {
  if (evt.target.parentElement.className === 'picture') {
    var target = evt.target;
    for (var i = 0; i < allPhotosArr.length; i++) {
      if (target.getAttribute('src') === allPhotosArr[i].url) {
        showBigPictureWithData(allPhotosArr[i]);
      }
    }
    document.addEventListener('keydown', overlayEscPressHandler);
    bigPictureClose.addEventListener('click', function () {
      bigPicture.classList.add('hidden');
    });
  }
};

// Открывает большую картинку по клику на миниатюру, вешает обработчик закрытия
picturesList.addEventListener('click', pictureClickHandler);


var validateFormHandler = function () {
  var hashtagArray = textHashtags.value.split(' ');
  var duplicatesCounter = 0;
  textHashtags.setCustomValidity('');
  for (var i = 0; i < hashtagArray.length; i++) {
    // Если в элементе массива '#' встречается больше 1 раза - кидаем CustomValidity
    if (hashtagArray[i].split('#').length - 1 > 1) {
      textHashtags.setCustomValidity('Хеш-теги должны разделяться пробелами');
    }
    // Если елемент заканчивается на '#', точку или запятую  - убираем
    while (hashtagArray[i].slice(-1) === '#' || hashtagArray[i].slice(-1) === ',' || hashtagArray[i].slice(-1) === '.' || hashtagArray[i].slice(-1) === '/') {
      hashtagArray[i] = hashtagArray[i].slice(0, -1);
    }
    // Если елемент не начинается с '#'  - ставим '#'
    if (hashtagArray[i].slice(0, 1) !== '#') {
      hashtagArray[i] = '#' + hashtagArray[i];
    }

    if (hashtagArray[i].length > 20) {
      textHashtags.setCustomValidity('Длина хеш-тега не может превышать 20 символов');
    }

    // Переводим все элементы в верхний регистр и сравниваем исходный массив с самим собой. Если совпадений больше, чем длинна массива - кидаем CustomValidity
    for (var j = 0; j < hashtagArray.length; j++) {
      if (hashtagArray[i].toUpperCase() === hashtagArray[j].toUpperCase()) {
        duplicatesCounter++;
      }
      if (duplicatesCounter > hashtagArray.length) {
        textHashtags.setCustomValidity('Хеш-теги не должны повторяться');
      }
    }
    // Чистим массив елементов от мусора и лишних пробелов
    while (hashtagArray[i] === '' || hashtagArray[i] === '#' || hashtagArray[i] === ' ') {
      hashtagArray.splice(i, 1);
    }
  }
  if (hashtagArray.length > 5) {
    textHashtags.setCustomValidity('Хеш-тегов не может быть более 5');
  }

  textHashtags.value = hashtagArray.join(' ');
};

textHashtags.addEventListener('blur', validateFormHandler);
