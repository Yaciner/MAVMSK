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

const changeDisplayDetail = (detailTitle, detailInfo, artwork, medialink) => {
  console.log(detailTitle, detailInfo, artwork);
  $detailTitle.textContent = detailTitle;
  $detailInfo.textContent = detailInfo;
  $detailImage.src = medialink;
}

const changeDidYouKnow = extrainfo => {
  $didYouKnow.innerText = extrainfo;
  console.log($didYouKnow);
}

const changeDisplayIdle = (what, artworkTitle, artworkYear, help) => {
  console.log('changeDisplayIdle');
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

const changeLanguageFlag = activeLanguage => {
  const $flagImg = document.querySelector(`.language-flag`);
  const $flagText = document.querySelector(`.language-text`);
  $flagImg.src = `/assets/img/languages/${activeLanguage}.png`;
  $flagText.innerText = activeLanguage;
}

const animationLoader = bodymovin.loadAnimation({
  container: document.getElementById('lottie'), // Required
  path: '../assets/json/data.json', // Required
  renderer: 'svg', // Required
  loop: false, // Optional
  autoplay: false // Optional
});

const playAnimationDetail = () => {
  console.log('play animation');
  // animationLoader.play();
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
    //hier kunnen we de ANIMATIE triggeren --> aangezien we er van uit gaan dat deze 1 maal gebeurd (Eventueel kunnen we hier ook een timer zetten?)
    console.log('zoom');
    changeDisplayDetail(detailTitle, detailInfo, activeArtworkTranslate, medialink);
    playAnimationDetail();
    idle = false;
  });

  socket.on('InfraredButton', (msg) => {
    console.log(msg);
  });

  socket.on('XrayButton', (msg) => {
    console.log(msg);
  });

  socket.on('MacroButton', (msg) => {
    console.log(msg);
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

  socket.on('potentiometer turn', (msg) => {
    console.log(msg);
  });

  socket.on('Idle', (what, artworkTitle, artworkYear, help) => {
    console.log('idle');
    changeDisplayIdle(what, artworkTitle, artworkYear, help);
    idle = true;
  });

  socket.on('Refresh', reload => {
    console.log(reload);
    location.reload();
  });

})();
// TODO show idle text on window load.
