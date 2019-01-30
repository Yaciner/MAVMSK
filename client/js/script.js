const messagesID = document.querySelector('#messages');
const titleID = document.querySelector('#title');
const infoID = document.querySelector('#info');
const artworkID = document.querySelector('#artwork');
let currentArtwork;

(() => {

  const socket = io();

  // socket.on('artwork', (msg) => {
  //   currentArtwork = msg;
  //   // dataLoaded(allData, currentArtwork);
  // })

  socket.on('EnterButton', (msg) => {
    console.log(msg);
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

  socket.on('LanguageButton', (activeArtworkTranslate, title, info) => {
    changeDisplay(title, info, activeArtworkTranslate);
  });

  socket.on('potentiometer turn', (msg) => {
    console.log(msg);
  });


})();

const changeDisplay = (title, info, artwork) => {
  // console.log('title', title);
  // console.log('info', info);
  // console.log('titleID', titleID);
  // console.log('infoID', infoID);
  titleID.textContent = title;
  infoID.textContent = info;
  artworkID.textContent = artwork;
}
