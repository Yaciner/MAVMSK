const generate = () => {
  const $container = document.querySelector('.indicators');
  document.createElement('div');
  const details = allData[activeArtwork]["numdetails"];

  for(let i = 0 ; i < details; i ++) {
    let $indicator = document.createElement('div');
    $indicator.classList.add('indicator');
    $container.appendChild($indicator);
    $indicator.style.transform = `translate(${allData[activeArtwork]['coordinates'][i].xi} , ${allData[activeArtwork]['coordinates'][i].yi} )`;
  }

  $circles.forEach(circle => {
    circle.className = 'indicator indicator_idle';
    console.log('done');
    circle.animate([
      { transform: `translate(${allData[activeArtwork]['coordinates'][i].xi} , ${allData[activeArtwork]['coordinates'][i].yi} ) scale(1)` },
              { transform: `translate(${allData[activeArtwork]['coordinates'][i].xi} , ${allData[activeArtwork]['coordinates'][i].yi} ) scale(.8)` },
      { transform: `translate(${allData[activeArtwork]['coordinates'][i].xi} , ${allData[activeArtwork]['coordinates'][i].yi} ) scale(1)` }
    ], {
      duration: 5000,
      iterations: Infinity,
      easing: 'ease-in-out'
    });
    i++
  });
}

module.exports = { generate };
