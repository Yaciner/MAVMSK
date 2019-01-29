const util = require('util');
const five = require('johnny-five');
const board = new five.Board();
const Readable = require('stream').Readable;
const mediumZoom = require('medium-zoom');
const server = require('express')();
const express = require('express');
const http = require('http').Server(server);
const io = require('socket.io')(http);
const path = require('path');
let allData = [];
let activeArtwork = "GiovanniArnolfini";
const languages = ["english", "nederlands", "francais", "espanol", "deutsche", "italiano"];
let activeLanguage = languages[0];

// const animationActive = require('./lib/animate').animationActive;
// const animationIdle = require('./lib/animate').animationIdle;

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

let freq = 20;
let buttonCircle = document.querySelector('.button-circle');
buttonCircle.style.fill = '#B84545';
let selectedDetail;
let selectedLanguage;

board.on('ready', () => {
  document.getElementById('board-status').src = './assets/ready.png';
  let artwork = document.querySelector('.artwork');
  let circles = document.querySelectorAll('.indicator');
  // let indicator = document.querySelector('.pot');

  io.emit('artwork', activeArtwork);

  let detailSelector = new five.Sensor({
    pin: 'A0',
    freq: freq,
  });

  let languageSelector = new five.Sensor({
    pin: 'A1',
    freq: freq,
  });

  let confirmButton = new five.Button(2);
  let macroButton = new five.Button(4);
  let infraredButton = new five.Button(7);
  let xrayButton = new five.Button(8);
  let languageButton = new five.Button(12);

  let isZoomedIn = false;

  macroButton.on("press", () => {
    console.log('button 2 pressed');
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

  languageButton.on("press", () => {
    console.log('button 5 pressed');
    const title = allData[activeArtwork]["details"][activeLanguage]["title"];
    const info = allData[activeArtwork]["details"][activeLanguage]["info"];

    io.emit('LanguageButton', title, info);
  });

  confirmButton.on("press", () => {
    console.log("Button 1 pressed");

    if (!isZoomedIn) {
      console.log('zooming in');
      isZoomedIn = true;
      artwork.classList.add(`zoomed-${selected + 1}`);
    } else {
      console.log('zooming out');
      isZoomedIn = false;
      artwork.classList.remove(`zoomed-${selected + 1}`);
    }

    // indicator.style.opacity = 0;
    io.emit('EnterButton', 'Enter pressed');
    // indicator.style.opacity = 0;
  });

  confirmButton.on("release", () => {
    console.log("Button released");
    buttonCircle.style.fill = '#B84545';
    // indicator.style.opacity = 1;
  });


  detailSelector.on("change", function() {
    selectedDetail = this.scaleTo(0, 4);
    circles.forEach(circle => {
      circle.className = 'indicator indicator_idle';
    });

    if(circles[selectedDetail]) {
      circles[selectedDetail].className = 'indicator indicator_active';
    }
  });

  languageSelector.on("change", function() {
    selectedLanguage = this.scaleTo(0, 5);

    // array with all the languages
    // change the active language on
    if(languages[selectedLanguage]) {
      activeLanguage = languages[selectedLanguage];
      const title = allData[activeArtwork]["details"][activeLanguage]["title"];
      const info = allData[activeArtwork]["details"][activeLanguage]["info"];

      io.emit('LanguageButton', title, info);
    }
  });
})
