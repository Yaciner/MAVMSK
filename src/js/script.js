const util = require('util');
const five = require('johnny-five');
const board = new five.Board();
const Readable = require('stream').Readable;
const mediumZoom = require('medium-zoom');

const bodymovin = require('lottie-web');


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

  button.on("hold", () => {
    console.log("Button held");
    buttonCircle.style.fill = '#46B766';
  });

  button.on("press", () => {
    console.log("Button pressed");
    buttonCircle.style.fill = '#46B766';
    console.log(artwork);
    artwork.classList.add(`zoomed-${selected + 1}`);
    indicator.style.opacity = 0;
  });

  button.on("release", () => {
    console.log("Button released");
    buttonCircle.style.fill = '#B84545';
    artwork.classList.remove(`zoomed-${selected + 1}`);
    indicator.style.opacity = 1;
  });


  sensor.on("change", function() {
    selected = this.scaleTo(0,6);
    circles.forEach(circle => {
      circle.style.fill = 'none';
    })

    if(circles[selected]) {
      circles[selected].style.fill = 'black';
    }
  });
})

const animate = () => {
  bodymovin.loadAnimation({
     container: document.querySelector(`.indicator_anim`),
     renderer: `svg`,
     loop: true,
     autoplay: true,
     path: `./assets/json/indicator_anim.json`
   });
}

animate();
