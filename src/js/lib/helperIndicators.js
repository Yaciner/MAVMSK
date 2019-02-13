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
}

module.exports = { generate };
