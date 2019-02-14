const bodymovin = require('lottie-web');

const animationActive = () => {
  bodymovin.loadAnimation({
     container: document.querySelector(`.indicator_active`),
     renderer: `svg`,
     loop: true,
     autoplay: true,
     path: `./assets/json/indicator_active.json`
   });
}

const animationIdle = (number) => {
  bodymovin.loadAnimation({
     container: document.querySelector(`.indicator_idle${number}`),
     renderer: `svg`,
     loop: true,
     autoplay: true,
     path: `./assets/json/indicator_idle.json`
   });
}

const animationDestroy = (div) => {
  bodymovin.destroy(div);
}

module.exports = { animationActive, animationIdle, animationDestroy };
