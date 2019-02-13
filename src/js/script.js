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
const connectionMessage = require('./lib/connectionMessage');
const changeMode = require('./lib/changeMode');
const helperZoom = require('./lib/helperZoom');
const helperIndicators = require('./lib/helperIndicators');
const helperShowText = require('./lib/helperShowText');
const helperLanguage = require('./lib/helperLanguage');

global.io = require('socket.io')(http);
global.didYouKnow = [];
global.allData = [];
global.activeArtwork = "virgin_annunciate";
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
global.connectDiv = document.querySelector('.connect');
global.medialink = '';
global.mode = 'macro';


const $artwork = document.querySelector('.artwork');
$artwork.src = `assets/img/${activeArtwork}/full/macro_after.png`;
changeMode.macro(activeArtwork, $artwork);

// TODO MOVE FUNCTIONS TO SEPERATE FILE AND WRITE INIT FUNCTION

fetch('./assets/json/artworks.json', {
  headers : {
   'Content-Type': 'application/json',
   'Accept': 'application/json'
  }
})
.then(response => response.json())
.then(results => {
  allData = results;
  console.log(allData);
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
  console.log('artworkTitle', artworkTitle);
  artworkYear = allData[activeArtwork]["details"]["year"];
  help = allData[activeArtwork]["idle_text"][activeLanguage]["help"];
  io.emit('Idle', what, artworkTitle, artworkYear, help);
  connectionMessage.hide(connectDiv);

  socket.on('disconnect', (reason) => {
    console.log('reason', reason);
    connectionMessage.show(connectDiv, ipAddress, port);
  });
});

http.listen(port, () => {
  console.log(`listening on ${ipAddress}:${port}`);
  connectionMessage.show(connectDiv, ipAddress, port);
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
    console.log('BUTTON macro pressed');
    // startAnimation();
    changeMode.macro(activeArtwork, $artwork);
    io.emit('MacroButton', 'Macro pressed');
  });

  infraredButton.on("press", () => {
    console.log('BUTTON infrared pressed');
    changeMode.infra(activeArtwork, $artwork);
    io.emit('InfraredButton', 'Infrared pressed');
  });

  xrayButton.on("press", () => {
    console.log('BUTTON xray pressed');
    changeMode.xray(activeArtwork, $artwork);
    io.emit('XrayButton', 'xRay pressed');
  });

  confirmButton.on("press", () => {
    console.log("BUTTON confirm pressed");

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
      console.log('done');
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
      console.log(allData[activeArtwork]['coordinates'][selectedDetail].xi);
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
      helperZoom.apply($artwork);
    }
  });
})
