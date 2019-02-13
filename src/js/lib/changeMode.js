const macro = (activeArtwork, $artwork) => {
  $artwork.src = `assets/img/${activeArtwork}/full/macro_after.png`;
  mode = 'macro';
  medialink = `assets/img/${activeArtwork}/details/${mode}_${selectedDetail}.png`;
  io.emit('ModeChanged', medialink);
}

const xray = (activeArtwork, $artwork) => {
  $artwork.src = `assets/img/${activeArtwork}/full/xray_after.png`;
  mode = 'xray';
  medialink = `assets/img/${activeArtwork}/details/${mode}_${selectedDetail}.png`;
  io.emit('ModeChanged', medialink);
}

const infra = (activeArtwork, $artwork) => {
  $artwork.src = `assets/img/${activeArtwork}/full/infra_after.png`;
  mode = 'infra';
  medialink = `assets/img/${activeArtwork}/details/${mode}_${selectedDetail}.png`;
  io.emit('ModeChanged', medialink);
}

module.exports = { macro, xray, infra };
