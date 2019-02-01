const $what = document.querySelector('#what');
const $artworkTitle = document.querySelector('#artwork-title');
const $detailTitle = document.querySelector('#detail-title');
const $artworkYear = document.querySelector('#artwork-year');
const $detailInfo = document.querySelector('#detail-info');
const $help = document.querySelector('#help');
const $idle = document.querySelector('#idle');
const $detailDisplay = document.querySelector('#detail-display');

const changeDisplayDetail = (detailTitle, detailInfo, artwork) => {
  console.log(detailTitle, detailInfo, artwork);
  $detailTitle.textContent = detailTitle;
  $detailInfo.textContent = detailInfo;
  // $artworkTitle.textContent = artwork;
  console.log('detail');
  $idle.style.display = 'none';
}

const changeDisplayIdle = (what, artworkTitle, artworkYear, help) => {
  $what.textContent = what;
  $artworkTitle.textContent = artworkTitle;
  $artworkYear.textContent = artworkYear;
  $help.textContent = help;
  console.log('idle');
  $detailDisplay.style.display = 'none';
}

const animationLoader = bodymovin.loadAnimation({
  container: document.getElementById('lottie'), // Required
  path: '../assets/json/data.json', // Required
  renderer: 'svg', // Required
  loop: false, // Optional
  autoplay: false, // Optional
});

const playAnimation = () => {
  console.log('play animation');
  animationLoader.play();
  setTimeout(function(){
    $idle.style.display = 'none';
    $detailDisplay.style.display = 'block';
  }, 500);
}

(() => {

  const socket = io();

  socket.on('EnterButton', (activeArtworkTranslate, detailTitle, detailInfo) => {
    //hier kunnen we de ANIMATIE triggeren --> aangezien we er van uit gaan dat deze 1 maal gebeurd (Eventueel kunnen we hier ook een timer zetten?)
    changeDisplayDetail(detailTitle, detailInfo, activeArtworkTranslate);
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

  socket.on('LanguageChange', (activeArtworkTranslate, detailTitle, detailInfo) => {
    changeDisplayDetail(detailTitle, detailInfo, activeArtworkTranslate);
  });

  socket.on('potentiometer turn', (msg) => {
    console.log(msg);
  });

  socket.on('Idle', (what, artworkTitle, artworkYear, help) => {
    changeDisplayIdle(what, artworkTitle, artworkYear, help);
  });

  socket.on('Refresh', reload => {
    console.log(reload);
    location.reload();
  });

  playAnimation();
})();
// TODO show idle text on window load.
