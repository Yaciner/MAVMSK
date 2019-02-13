const macro = (activeArtwork, $artwork) => {
  $artwork.src = `assets/${activeArtwork}/full/macro_after.png`;
  mode = 'macro';
}

const xray = (activeArtwork, $artwork) => {
  $artwork.src = `assets/${activeArtwork}/full/xray_after.png`;
  mode = 'xray';
}

const infra = (activeArtwork, $artwork) => {
  $artwork.src = `assets/${activeArtwork}/full/infra_after.png`;
  mode = 'infra';
}

module.exports = { macro, xray, infra };
