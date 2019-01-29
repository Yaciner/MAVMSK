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

const animationActive = require('./lib/animate').animationActive;
const animationIdle = require('./lib/animate').animationIdle;
let allData = [];

// animationIdle(1);

const indicators = document.querySelectorAll(`.indicator`);
// opvragen hoeveel indicators er zijn
// dan class name = ${`indicator`i+1}
// dan animation function maken dat die een var met het nummer binnen laat.
// indicatorsIdle.forEach((div) => {
//   console.log(counter);
//   animationIdle(counter);
//   counter++
// });
console.log('indicatorsIdle', indicators);
for (i = 0; i < indicators.length; ++i) {
  console.log('i', i);
  // animationIdle(i);
}

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


let activeArtwork = "GiovanniArnolfini";

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
let selected;


board.on('ready', () => {
  // animationActive();
  document.getElementById('board-status').src = './assets/ready.png';
  let artwork = document.querySelector('.artwork');
  let circles = document.querySelectorAll('.indicator');
  let indicator = document.querySelector('.pot');

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
    io.emit('LanguageButton', 'Language pressed');
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
    io.emit('button pressed', 'button is pressed');
  });

  confirmButton.on("release", () => {
    console.log("Button released");
    buttonCircle.style.fill = '#B84545';
    // indicator.style.opacity = 1;
  });


  sensor.on("change", function() {
    // console.log('change');
    // console.log('circles', circles);
    selected = this.scaleTo(0, 4);
    circles.forEach(circle => {
      circle.className = 'indicator indicator_idle'
    });



    if(circles[selected]) {
      circles[selected].style.fill = '#B84545';
      console.log(circles[selected]);
      circles[selected].className = 'indicator indicator_active';
    }

    io.emit('potentiometer turn', 'potentiometer is turned');
  });
})
