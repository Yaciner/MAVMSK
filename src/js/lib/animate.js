const bodymovin = require('lottie-web');

const animate = () => {
  console.log('animate');
  bodymovin.loadAnimation({
     container: document.querySelector(`.indicator_anim`),
     renderer: `svg`,
     loop: true,
     autoplay: true,
     path: `./assets/json/indicator_anim.json`
   });
}

module.exports = animate;
