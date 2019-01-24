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
const animate = require('./lib/animate');

server.use(express.static(path.join(__dirname, '../../client')));

server.get('/', function(req, res){
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
  document.getElementById('board-status').src = './assets/ready.png';
  let artwork = document.querySelector('.artwork');
  let circles = document.querySelectorAll('.st0');
  let indicator = document.querySelector('.pot');


  let sensor = new five.Sensor({
    pin: 'A0',
    freq: freq,
  })


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

    indicator.style.opacity = 0;
    io.emit('button pressed', 'button is pressed');
  });

  button.on("release", () => {
    console.log("Button released");
    buttonCircle.style.fill = '#B84545';
    indicator.style.opacity = 1;
  });


  sensor.on("change", function() {
    selected = this.scaleTo(0,6);
    circles.forEach(circle => {
      circle.style.fill = 'none';
    })

    if(circles[selected]) {
      circles[selected].style.fill = '#B84545';
    }

    io.emit('potentiometer turn', 'potentiometer is turned');
  });
})

animate();
