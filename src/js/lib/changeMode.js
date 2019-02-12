const macro = (activeArtwork, $artwork) => {
  $artwork.src = `assets/${activeArtwork}/full/macro_after.png`;
}

const xray = (activeArtwork, $artwork) => {
  $artwork.src = `assets/${activeArtwork}/full/xray_after.png`;
}

const infra = (activeArtwork, $artwork) => {
  $artwork.src = `assets/${activeArtwork}/full/infra_after.png`;
}

module.exports = { macro, xray, infra };
