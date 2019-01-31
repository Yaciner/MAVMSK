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
let activeArtworkTranslate = "";
const languages = ["english", "nederlands", "francais", "espanol", "deutsche", "italiano"];
let activeLanguage = languages[1];
let title = "";
let info = "";

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
const freqLanguage = 250;
let selectedDetail = 0;
let selectedLanguage = 0;

const changeLanguage = () => {
  console.log(activeLanguage);
  title = allData[activeArtwork]["details"][activeLanguage][selectedDetail].title;
  info = allData[activeArtwork]["details"][activeLanguage][selectedDetail].info;
}

board.on('ready', () => {
  document.getElementById('board-status').src = './assets/ready.png';
  let artwork = document.querySelector('.artwork');
  let circles = document.querySelectorAll('.indicator');

  changeLanguage();

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

  let isZoomedIn = false;

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

  // languageButton.on("press", () => {
  //   console.log('button 5 pressed');
  //   const title = allData[activeArtwork]["details"][activeLanguage]["title"];
  //   const info = allData[activeArtwork]["details"][activeLanguage]["info"];
  //
  //   io.emit('LanguageButton', title, info);
  // });

  confirmButton.on("press", () => {
    console.log("Button 1 pressed");
    console.log(selectedDetail);

    if (!isZoomedIn) {
      console.log('zooming in');
      isZoomedIn = true;
      document.body.style.transform = `scale(${allData[activeArtwork]['coordinates'][selectedDetail].s})`;
      document.body.style.transform += `translate(${allData[activeArtwork]['coordinates'][selectedDetail].x + ',' + allData[activeArtwork]['coordinates'][selectedDetail].y})`;

      console.log(allData[activeArtwork]["details"][activeLanguage][selectedDetail].title);
      title = allData[activeArtwork]["details"][activeLanguage][selectedDetail].title;
      info = allData[activeArtwork]["details"][activeLanguage][selectedDetail].info;
      activeArtworkTranslate = allData[activeArtwork]['title'][activeLanguage];
      console.log(selectedLanguage);
      activeLanguage = languages[selectedLanguage];


      io.emit('EnterButton', title, info, activeArtworkTranslate);
    } else {
      console.log('zooming out');
      isZoomedIn = false;
      document.body.style.transform = `scale(1)`;
      document.body.style.transform += `translate(0)`;
    }

    new Typed('.indicator--information', {
      strings: [`Linken we de taal aan de titel of niet?`],
      typeSpeed: 10,
      backSpeed: 0,
      smartBackspace: true,
      fadeOut: true,
      loop: false
      });
      // console.log(allData[activeArtwork]["details"][activeLanguage][selectedDetail].title);

  });

  detailSelector.on("change", function() {
    selectedDetail = this.scaleTo(0, allData[activeArtwork]['numdetails']);
    console.log('detail selector');
    console.log(selectedDetail);



    circles.forEach(circle => {
      circle.className = 'indicator indicator_idle';
      circle.animate([
        // keyframes
        { transform: 'translateY(0px)' },
        { transform: 'translateY(-300px)' }
      ], {
        // timing options
        duration: 1000,
        iterations: Infinity
      });
    });

    if(circles[selectedDetail]) {
      circles[selectedDetail].className = 'indicator indicator_active';
    }
  });

  languageSelector.on("change", function() {
    selectedLanguage = this.scaleTo(0, 5);
    title = allData[activeArtwork]["details"][activeLanguage][selectedDetail].title;
    info = allData[activeArtwork]["details"][activeLanguage][selectedDetail].info;
    activeArtworkTranslate = allData[activeArtwork]['title'][activeLanguage];

    if(languages[selectedLanguage]) {
      activeLanguage = languages[selectedLanguage];
      console.log(activeLanguage);
      changeLanguage();
      io.emit('LanguageButton', activeArtworkTranslate, title, info);
    }
  });
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
    $indicator.style.transform = `rotate(270deg)`;
    $indicator.style.transform += `translate(${allData[activeArtwork]['coordinates'][i].x + ',' + allData[activeArtwork]['coordinates'][i].y})`;
  }
  readCoordinates(details);
}

const readCoordinates = details => {
  // const $indicators = document.querySelectorAll('.indicator');
  // $indicators.forEach($indicator => {
  //   for(let i = 0; i < details; i ++) {
  //     $indicator.style.transform = `translate(${allData[activeArtwork]['coordinates'][i].x + ',' + allData[activeArtwork]['coordinates'][i].y})`;
  //   }
  // })
}
