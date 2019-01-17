var util = require('util')
var line = require('lightning-line')
const five = require('johnny-five');
const board = new five.Board();

const Readable = require('stream').Readable;
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
board.on('ready', () => {
  document.getElementById('board-status').src = './assets/ready.png';
  let circles = document.querySelectorAll('.st0');


  let sensor = new five.Sensor({
    pin: 'A0',
    freq: freq,
  })

  let button = new five.Button(2);

  button.on("hold", () => {
    console.log( "Button held" );
    buttonCircle.style.fill = '#46B766';
  });

  button.on("press", () => {
    console.log( "Button pressed" );
    buttonCircle.style.fill = '#46B766';
  });

  button.on("release", () => {
    console.log( "Button released" );
    buttonCircle.style.fill = '#B84545';
  });


  sensor.on("change", function() {
    let selected = this.scaleTo(0,6);
    circles.forEach(circle => {
      circle.style.fill = 'white';
    })

    if(circles[selected]) {
      circles[selected].style.fill = 'black';
    }
    console.log(selected);
  });
})
