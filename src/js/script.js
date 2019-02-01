const util = require('util');
const five = require('johnny-five');
const board = new five.Board();
const Readable = require('stream').Readable;
const mediumZoom = require('medium-zoom');
const server = require('express')();
const express = require('express');
const Typed = require('typed.js');
const http = require('http').Server(server);
const io = require('socket.io')(http);
const path = require('path');
let allData = [];
let activeArtwork = "JoosVijd";
let artworkTitle = "";
const languages = ["english", "nederlands", "francais", "espanol", "deutsche", "italiano"];
let activeLanguage = languages[1];
let title = "";
let info = "";
let isZoomedIn = false;
let zoomIsActive = false;
let artwork = document.querySelector('.artwork');
let zoomTimer;
let detailTitle = "";
let detailInfo = "";

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
  generateIndicators(allData);
}).catch((e => console.log(e)));

server.use(express.static(path.join(__dirname, '../../client')));

server.get('/', function(req, res) {
  console.log('req', req);
  res.sendFile('index.html');
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});

// TODO uncomment to access from tablet
// http.listen(3000, '192.168.2.14', () => {
//   console.log('listening on *:3000 local ip');
// });

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

const freq = 50;
const freqLanguage = 50;
let selectedDetail = 0;
let selectedLanguage = 0;

const changeLanguage = () => {
  console.log(activeLanguage);
  detailTitle = allData[activeArtwork]["details"][activeLanguage][selectedDetail].title;
  detailInfo = allData[activeArtwork]["details"][activeLanguage][selectedDetail].info;
}

const showDisplayIdle = () => {
  console.log(activeLanguage);
  console.log(activeArtwork);
  console.log(allData[activeArtwork]["idle_text"]);
  const what = allData[activeArtwork]["idle_text"][activeLanguage]["what"];
  artworkTitle = allData[activeArtwork]["title"][activeLanguage];
  const artworkYear = allData[activeArtwork]["details"]["year"];
  const help = allData[activeArtwork]["idle_text"][activeLanguage]["help"];
  io.emit('Idle', what, artworkTitle, artworkYear, help);
}

board.on('ready', () => {
  io.emit('Refresh', 'reload');

  document.getElementById('board-status').src = './assets/ready.png';
  let artwork = document.querySelector('.artwork');
  let circles = document.querySelectorAll('.indicator');

  showDisplayIdle();

  let detailSelector = new five.Sensor({
    pin: 'A1',
    freq: freq,
    threshold: 5
  });

  let languageSelector = new five.Sensor({
    pin: 'A2',
    freq: freqLanguage,
    threshold: 5
  });

  let confirmButton = new five.Button(2);
  let macroButton = new five.Button(4);
  let infraredButton = new five.Button(7);
  let xrayButton = new five.Button(8);
  // let languageButton = new five.Button(12);

  macroButton.on("press", () => {
    console.log('button 2 pressed');
    startAnimation();
    io.emit('MacroButton', 'Macro pressed');
  });

  infraredButton.on("press", () => {
    console.log('button 3 pressed');
    io.emit('InfraredButton', 'Infrared pressed');
  });

  xrayButton.on("press", () => {
    console.log('button 4 pressed');
    io.emit('XrayButton', 'xRay pressed');
  });

  confirmButton.on("press", () => {
    console.log("Button 1 pressed");

    if (!isZoomedIn && !zoomIsActive) {
      zoomIn();
      zoomTimer = setInterval(() => { zoomOut(); }, 5000);
    } else {
      zoomOut();

    }
      detailTitle = allData[activeArtwork]["details"][activeLanguage][selectedDetail].title;
      detailInfo = allData[activeArtwork]["details"][activeLanguage][selectedDetail].info;
      activeArtworkTranslate = allData[activeArtwork]['title'][activeLanguage];
      activeLanguage = languages[selectedLanguage];

      io.emit('Zoom', detailTitle, info, activeArtworkTranslate);
  });

  detailSelector.on("change", function() {
    selectedDetail = this.scaleTo(0, allData[activeArtwork]['numdetails']);
    console.log('detail selector');
    console.log(selectedDetail);
    let i = 0;
    circles.forEach(circle => {
      circle.className = 'indicator indicator_idle';
      circle.animate([
        { transform: `translate(${allData[activeArtwork]['coordinates'][i].xi} , ${allData[activeArtwork]['coordinates'][i].yi} ) scale(1)` },
                { transform: `translate(${allData[activeArtwork]['coordinates'][i].xi} , ${allData[activeArtwork]['coordinates'][i].yi} ) scale(.8)` },
        { transform: `translate(${allData[activeArtwork]['coordinates'][i].xi} , ${allData[activeArtwork]['coordinates'][i].yi} ) scale(1)` }
      ], {
        duration: 1000,
        iterations: Infinity
      });
      i++
    });

    if(circles[selectedDetail]) {
      circles[selectedDetail].className = 'indicator indicator_active';
      console.log(allData[activeArtwork]['coordinates'][selectedDetail].xi);
      circles[selectedDetail].animate([
        { transform: `translate(${allData[activeArtwork]['coordinates'][selectedDetail].xi} , ${allData[activeArtwork]['coordinates'][selectedDetail].yi} ) rotate(0deg)` },
        { transform: `translate(${allData[activeArtwork]['coordinates'][selectedDetail].xi} , ${allData[activeArtwork]['coordinates'][selectedDetail].yi} ) rotate(360deg)` }
      ], {
        duration: 1000,
        iterations: Infinity
      });
    }
  });

  // languageSelector.on("change", function() {
  //   selectedLanguage = this.scaleTo(0, 5);
  //   detailTitle = allData[activeArtwork]["details"][activeLanguage][selectedDetail].title;
  //   detailInfo = allData[activeArtwork]["details"][activeLanguage][selectedDetail].info;
  //   artworkTitle = allData[activeArtwork]['title'][activeLanguage];
  //
  //   if(languages[selectedLanguage]) {
  //     activeLanguage = languages[selectedLanguage];
  //     console.log(activeLanguage);
  //     changeLanguage();
  //     io.emit('LanguageChange', artworkTitle, detailTitle, detailInfo);
  //   }
  // });
})

const startAnimation = () => {
  console.log('starting');
  document.querySelector('.video--macro').style.opacity = '1';
  document.querySelector('.video--macro').play();
}

const generateIndicators = allData => {
  const $container = document.querySelector('.indicators');
  document.createElement('div');
  const details = allData[activeArtwork]["numdetails"];

  for(let i = 0 ; i < details; i ++) {
    let $indicator = document.createElement('div');
    $indicator.classList.add('indicator');
    $container.appendChild($indicator);
    $indicator.style.transform = `translate(${allData[activeArtwork]['coordinates'][i].xi} , ${allData[activeArtwork]['coordinates'][i].yi} )`;
  }
}

const zoomIn = () => {
  console.log('zooming in');
  isZoomedIn = true;

  console.log(selectedDetail);
  artwork.style.transform = `scale(${allData[activeArtwork]['coordinates'][selectedDetail].s})`;
  artwork.style.transform += `translate(${allData[activeArtwork]['coordinates'][selectedDetail].x + ',' + allData[activeArtwork]['coordinates'][selectedDetail].y})`;

  console.log(allData[activeArtwork]["details"][activeLanguage][selectedDetail].title);
  title = allData[activeArtwork]["details"][activeLanguage][selectedDetail].title;
  info = allData[activeArtwork]["details"][activeLanguage][selectedDetail].info;
  activeArtworkTranslate = allData[activeArtwork]['title'][activeLanguage];
  console.log(selectedLanguage);
  activeLanguage = languages[selectedLanguage];
    document.querySelectorAll('.indicator').forEach($indicator => {
      $indicator.style.opacity = '0';

    })
    new Typed('.indicator--information', {
      strings: [`Linken we de taal aan de titel of niet?`],
      typeSpeed: 10,
      backSpeed: 0,
      smartBackspace: true,
      fadeOut: true,
      loop: false
      });
  io.emit('Zoom', title, info, activeArtworkTranslate);
}

const zoomOut = () => {
    clearInterval(zoomTimer);
    isZoomedIn = false;
    artwork.style.transform = `scale(1)`;
    artwork.style.transform += `translate(0)`;
    document.querySelectorAll('.indicator').forEach($indicator => {
      $indicator.style.opacity = '1';
    })
    document.querySelector('.indicator--information').innerText = '';
}
