const messagesID = document.querySelector('#messages');
let allData = [];
let currentArtwork;


(() => {

  fetch('./assets/data/Artworks.json', {
    headers : {
     'Content-Type': 'application/json',
     'Accept': 'application/json'
    }
  })

  .then(response => response.json())
  .then(results => {
    allData = results;

  }).catch((e => console.log(e)));

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

  socket.on('LanguageButton', (msg) => {
    console.log(msg);
  });

  socket.on('potentiometer turn', (msg) => {
    console.log(msg);
  });

  const dataLoaded = (allData, currentArtwork) => {
    console.log(allData[currentArtwork]);
  }


})();
