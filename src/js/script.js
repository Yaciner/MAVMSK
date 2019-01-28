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

server.use(express.static(path.join(__dirname, '../../client')));

server.get('/', function(req, res) {
  console.log('req', req);
  res.sendFile('index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(3000, function(){
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


  let sensor = new five.Sensor({
    pin: 'A0',
    freq: freq,
  });

  let button = new five.Button(2);
  let button2 = new five.Button(4);
  let button3 = new five.Button(7);
  let button4 = new five.Button(8);
  let button5 = new five.Button(12);
  let isZoomedIn = false;

  button.on("hold", () => {
    console.log("Button held");
    buttonCircle.style.fill = '#46B766';
  });

  button2.on("press", () => {
    console.log('button 2 pressed');
  });

  button3.on("press", () => {
    console.log('button 3 pressed');
  });

  button4.on("press", () => {
    console.log('button 4 pressed');
  });

  button5.on("press", () => {
    console.log('button 5 pressed');
  });

  button.on("press", () => {
    console.log("Button 1 pressed");
    buttonCircle.style.fill = '#46B766';
    console.log(artwork);

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
    io.emit('button pressed', 'button is pressed');
  });

  button.on("release", () => {
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

      // TODO iedere change active class vervangen door idle op de niet geslsecteerde divs en animationIdle zetten
      // op de geslecteerde div active class zetten en animationActive zetten

      // const activediv = document.querySelector(`.indicator_active`);
      // // animationDestroy(activediv);
      // console.log(activediv.firstChild);
      // while (activediv.firstChild) {
      //   console.log('deleting');
      //     activediv.removeChild(activediv.firstChild);
      //     activediv.classList.remove = '.indicator_active';
      // }
      //
      // circles[selected].classList.add = '.indicator_active';
      // animationActive();
    }

    io.emit('potentiometer turn', 'potentiometer is turned');
  });
})
