const messagesID = document.querySelector('#messages');
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

  socket.on('LanguageButton', (msg) => {
    console.log(msg);
  });

  socket.on('potentiometer turn', (msg) => {
    console.log(msg);
  });


})();
