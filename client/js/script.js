const $what = document.querySelector('#what');
const $artworkTitle = document.querySelector('#artwork-title');
const $detailTitle = document.querySelector('#detail-title');
const $artworkYear = document.querySelector('#artwork-year');
const $detailInfo = document.querySelector('#detail-info');
const $help = document.querySelector('#help');
const $idle = document.querySelector('#idle');
const $detailDisplay = document.querySelector('#detail-display');
const $detailImage = document.querySelector('#detail-image');
const $didYouKnow = document.querySelector('.didyouknow');
let idle = true;
let isZoomedIn = false;

console.log('https://github.com/Yaciner/MAVMSK/tree/master');

const changeDisplayDetail = (detailTitle, detailInfo, artwork, medialink) => {
  $detailTitle.textContent = detailTitle;
  $detailInfo.textContent = detailInfo;
  $detailImage.src = medialink;
}

const changeDidYouKnow = extrainfo => {
  $didYouKnow.innerText = extrainfo;
}

const changeDisplayIdle = (what, artworkTitle, artworkYear, help) => {
  $what.textContent = what;
  $artworkTitle.textContent = artworkTitle;
  $artworkYear.textContent = ', ' + artworkYear;
  $help.textContent = help;
  animationLoader.goToAndPlay(0);
  $idle.classList.remove('move-to-right-out');
  $idle.classList.add('move-to-right-in');
  $detailDisplay.classList.remove('move-to-right-in');
  $detailDisplay.classList.add('move-to-right-out');

  setTimeout(function(){
    $detailDisplay.style.display = 'none';
    $idle.style.display = 'flex';
  }, 450);
}

// const changeLanguageFlag = activeLanguage => {
//   const $flagImg = document.querySelector(`.language-flag`);
//   const $flagText = document.querySelector(`.language-text`);
//   $flagImg.src = `/assets/img/languages/${activeLanguage}.png`;
//   $flagText.innerText = activeLanguage;
// }

const animationLoader = bodymovin.loadAnimation({
  container: document.getElementById('lottie'),
  path: '../assets/json/animation.json',
  renderer: 'svg',
  loop: false,
  autoplay: false
});

const playAnimationDetail = () => {
  animationLoader.goToAndPlay(0);
  $idle.classList.remove('move-to-right-in');
  $idle.classList.add('move-to-right-out');
  $detailDisplay.classList.add('move-to-right-in');
  $detailDisplay.classList.remove('move-to-right-out');
  setTimeout(function(){
    $idle.style.display = 'none';
    $detailDisplay.style.display = 'flex';
  }, 450);
}

(() => {

  const socket = io();

  socket.on('Zoom', (detailTitle, detailInfo, activeArtworkTranslate, medialink) => {
    changeDisplayDetail(detailTitle, detailInfo, activeArtworkTranslate, medialink);
    if (!isZoomedIn) {
      isZoomedIn = true;
      playAnimationDetail();
    }
    idle = false;
  });

  socket.on('didyouknow', (extrainfo) => {
    changeDidYouKnow(extrainfo);
  });

  socket.on('ModeChanged', (medialink) => {
    $detailImage.src = medialink;
  });

  socket.on('LanguageChange', (activeArtworkTranslate, detailTitle, detailInfo, what, artworkTitle, artworkYear, help, medialink, activeLanguage) => {
    changeLanguageFlag(activeLanguage);
    if (idle) {
      changeDisplayIdle(what, artworkTitle, artworkYear, help);
    } else {
      changeDisplayDetail(detailTitle, detailInfo, activeArtworkTranslate, medialink);
    }
  });

  socket.on('Idle', (what, artworkTitle, artworkYear, help) => {
    isZoomedIn = false;
    changeDisplayIdle(what, artworkTitle, artworkYear, help);
    idle = true;
  });

  socket.on('Refresh', reload => {
    console.log(reload);
    location.reload();
  });

})();
