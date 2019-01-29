const messagesID = document.querySelector('#messages');
const titleID = document.querySelector('#title');
const infoID = document.querySelector('#info');
let currentArtwork;

(() => {

  const socket = io();

  socket.on('artwork', (msg) => {
    currentArtwork = msg;
    dataLoaded(allData, currentArtwork);
  })

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

  socket.on('LanguageButton', (title, info) => {
    // console.log(title);
    changeDisplay(title, info);
  });

  socket.on('potentiometer turn', (msg) => {
    console.log(msg);
  });


})();

const changeDisplay = (title, info) => {
  // console.log('title', title);
  // console.log('info', info);
  // console.log('titleID', titleID);
  // console.log('infoID', infoID);
  titleID.textContent = title;
  infoID.textContent = info;
}
