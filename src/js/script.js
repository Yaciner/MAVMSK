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
let activeArtwork = "JoosVijd";
let activeLanguage = "english";


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
  startZoom(allData);

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
let selected = 1;
let isZoomedIn = false;
let artwork = document.querySelector('.artwork');


const startZoom = data => {
  if (!isZoomedIn) {
    console.log('zooming in');
    isZoomedIn = true;
    // artwork.classList.add(`${activeArtwork + '-' + selected}`);
    artwork.style.transform = `scale(${data[activeArtwork]['coordinates'][selected].s})`;
    artwork.style.transform += `translate(${data[activeArtwork]['coordinates'][selected].x + ',' + data[activeArtwork]['coordinates'][selected].y})`;
    console.log(activeArtwork + '-' + selected + 1);
  } else {
    console.log('zooming out');
    isZoomedIn = false;
    artwork.classList.remove(`${activeArtwork + '-' + selected}`);
  }
  console.log(data[activeArtwork]['coordinates'][selected].x);
}

// setInterval(() => {startAnimation()}, 4000);


board.on('ready', () => {
  document.getElementById('board-status').src = './assets/ready.png';
  let artwork = document.querySelector('.artwork');
  let circles = document.querySelectorAll('.indicator');
  // let indicator = document.querySelector('.pot');

  io.emit('artwork', activeArtwork);

  let sensor = new five.Sensor({
    pin: 'A0',
    freq: freq,
  })

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

    // io.emit('LanguageButton', 'Language pressed');
    io.emit('LanguageButton', title, info);

    //get which artwork is displayed
    console.log('allData[activeArtwork]', allData[activeArtwork]);
    //change text based on language.
    console.log(allData[activeArtwork]["details"][activeLanguage]["info"]);
    // emit a message
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



  sensor.on("change", function() {
    selected = this.scaleTo(0, 4);
    circles.forEach(circle => {
      circle.className = 'indicator indicator_idle'
    });

    if(circles[selected]) {
      circles[selected].className = 'indicator indicator_active';
    }
  });
})

const startAnimation = () => {
  console.log('starting');
  document.querySelector('.video--macro').style.opacity = '1';
  document.querySelector('.video--macro').play();
}
