const port = 3000;
const five = require('johnny-five');
const board = new five.Board();
const Readable = require('stream').Readable;
const server = require('express')();
const express = require('express');
const ip = require('ip');
const ipAddress = ip.address();
const http = require('http').Server(server);
const path = require('path');
const notificationMessage = require('./lib/notificationMessage');
const changeMode = require('./lib/changeMode');
const helperZoom = require('./lib/helperZoom');
const helperIndicators = require('./lib/helperIndicators');
const helperShowText = require('./lib/helperShowText');
const helperLanguage = require('./lib/helperLanguage');
const artworks = ["virgin_annunciate", "giovanni_arnolfini"];

global.io = require('socket.io')(http);
global.fs = require('fs')
global.didYouKnow = [];
global.allData = [];
global.activeArtwork = artworks[1];
global.artworkTitle = "";
global.languages = ["english", "nederlands", "francais", "espanol", "deutsche", "italiano"];
global.activeLanguage = languages[1];
global.selectedLanguage = 0;
global.previousLanguage = '';
global.selectedDetail = 0;
global.title = "";
global.info = "";
global.isZoomedIn = false;
global.zoomTimer;
global.detailTitle = "";
global.detailInfo = "";
global.artworkYear = 1302;
global.help = "Press the button";
global.what = "what what what?¿";
global.notificationDiv = document.querySelector('.notification');
global.medialink = '';
global.mode = 'macro';
global.errors = {
  "english": "Mode not available for this artwork.",
  "nederlands": "Mode niet beschikbaar voor dit kunstwerk.",
  "francais": "Ce mode n'est pas disponible pour ce tableau.",
  "espanol": "Modo no disponible para esta obra de arte.",
  "deutsche": "Modus ist für dieses Kunstwerk nicht verfügbar.",
  "italiano": "Modalità non disponibile per questa illustrazione."
}

console.log('errors[activeLanguage]', errors[activeLanguage]);

const $artwork = document.querySelector('.artwork');
$artwork.src = `assets/img/${activeArtwork}/full/macro_after.png`;
changeMode.macro(activeArtwork, $artwork);

console.log('https://github.com/Yaciner/MAVMSK/tree/master');

fetch('./assets/json/artworks.json', {
  headers : {
   'Content-Type': 'application/json',
   'Accept': 'application/json'
  }
})
.then(response => response.json())
.then(results => {
  allData = results;
  helperIndicators.generate();
}).catch((e => console.log(e)));

fetch('./assets/json/didyouknows.json', {
  headers : {
   'Content-Type': 'application/json',
   'Accept': 'application/json'
  }
})
.then(response => response.json())
.then(results => {
  didYouKnow = results;
}).catch((e => console.log(e)));

server.use(express.static(path.join(__dirname, '../../client')));

server.get('/', (req, res) => {
  console.log('req', req);
  res.sendFile('index.html');
});

io.on('connection', (socket) => {
  what = allData[activeArtwork]["idle_text"][activeLanguage]["what"];
  artworkTitle = allData[activeArtwork]["title"][activeLanguage];
  artworkYear = allData[activeArtwork]["details"]["year"];
  help = allData[activeArtwork]["idle_text"][activeLanguage]["help"];
  io.emit('Idle', what, artworkTitle, artworkYear, help);
  notificationMessage.hideConnect(notificationDiv);

  socket.on('disconnect', (reason) => {
    console.log('reason', reason);
    notificationMessage.showConnect(notificationDiv, ipAddress, port);
  });
});

http.listen(port, () => {
  console.log(`listening on ${ipAddress}:${port}`);
  notificationMessage.showConnect(notificationDiv, ipAddress, port);
});

class MyStream extends Readable {
  constructor(opts) {
    super(opts);
  }
  _read() {}
}

// hook in our stream
process.__defineGetter__('stdin', () => {
  if (process.__stdin)
    return process.__stdin;
  process.__stdin = new MyStream();
  return process.__stdin;
}); {};


const startDidYouKnows = setInterval(() => {
  helperShowText.didYouKnows(io);
}, 10000);

board.on('ready', () => {
  io.emit('Refresh', 'reload');

  document.getElementById('board-status').src = './assets/ready.png';
  const $circles = document.querySelectorAll('.indicator');

  helperShowText.didYouKnows(io);
  helperShowText.idle();

  let detailSelector = new five.Sensor({
    pin: 'A1',
    freq: 50,
    threshold: 5
  });

  let languageSelector = new five.Sensor({
    pin: 'A2',
    freq: 50,
    threshold: 5
  });

  let confirmButton = new five.Button(2);
  let macroButton = new five.Button(4);
  let infraredButton = new five.Button(7);
  let xrayButton = new five.Button(12);

  macroButton.on("press", () => {
    changeMode.macro(activeArtwork, $artwork);
  });

  infraredButton.on("press", () => {
    changeMode.infra(activeArtwork, $artwork);
  });

  xrayButton.on("press", () => {
    changeMode.xray(activeArtwork, $artwork);
  });

  confirmButton.on("press", () => {
    if (!isZoomedIn) {
      helperZoom.into($artwork, io);
      zoomTimer = setInterval(() => { helperZoom.out($artwork, io); }, 30000);
    } else {
      helperZoom.out($artwork, io);
    }
    detailTitle = allData[activeArtwork]["details"][activeLanguage][selectedDetail].title;
    detailInfo = allData[activeArtwork]["details"][activeLanguage][selectedDetail].info;
    activeArtworkTranslate = allData[activeArtwork]['title'][activeLanguage];
    activeLanguage = languages[selectedLanguage];
  });

  languageSelector.on("change", function() {
    selectedLanguage = this.scaleTo(0, languages.length - 1);
    activeLanguage = languages[selectedLanguage];
    helperLanguage.change();
  });

  detailSelector.on("change", function() {
    selectedDetail = this.scaleTo(0, allData[activeArtwork]['numdetails']);
    let i = 0;
    $circles.forEach(circle => {
      circle.className = 'indicator indicator_idle';
      circle.animate([
        { transform: `translate(${allData[activeArtwork]['coordinates'][i].xi} , ${allData[activeArtwork]['coordinates'][i].yi} ) scale(1)` },
                { transform: `translate(${allData[activeArtwork]['coordinates'][i].xi} , ${allData[activeArtwork]['coordinates'][i].yi} ) scale(.8)` },
        { transform: `translate(${allData[activeArtwork]['coordinates'][i].xi} , ${allData[activeArtwork]['coordinates'][i].yi} ) scale(1)` }
      ], {
        duration: 5000,
        iterations: Infinity,
        easing: 'ease-in-out'
      });
      i++
    });

    if($circles[selectedDetail]) {
      $circles[selectedDetail].className = 'indicator indicator_active';
      $circles[selectedDetail].animate([
        { transform: `translate(${allData[activeArtwork]['coordinates'][selectedDetail].xi} , ${allData[activeArtwork]['coordinates'][selectedDetail].yi} ) rotate(0deg)` },
        { transform: `translate(${allData[activeArtwork]['coordinates'][selectedDetail].xi} , ${allData[activeArtwork]['coordinates'][selectedDetail].yi} ) rotate(360deg)` }
      ], {
        duration: 1400,
        iterations: Infinity,
        easing: 'cubic-bezier(0.42, 0, 0.58, 1)'
      });
    }

    if (isZoomedIn) {
      helperZoom.clear($artwork);
      // helperZoom.apply($artwork);
      helperZoom.into($artwork, io);
    }
  });
})
