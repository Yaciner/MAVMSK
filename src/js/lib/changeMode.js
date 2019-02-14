const notificationMessage = require('./notificationMessage');

const macro = (activeArtwork, $artwork) => {
  $artwork.src = `assets/img/${activeArtwork}/full/macro_after.png`;
  mode = 'macro';
  medialink = `assets/img/${activeArtwork}/details/${mode}_${selectedDetail}.png`;
  io.emit('ModeChanged', medialink);
}

const xray = (activeArtwork, $artwork) => {
  const path = `./src/assets/img/${activeArtwork}/full/xray_after.png`;

  fs.access(path, fs.F_OK, (err) => {
    if (err) {
      console.log(err + 'THIS ERROR CAN BE REMOVED. JUST NEEDS TO BE A UX FRIENDLY NOTICE');
      notificationMessage.showModeError(notificationDiv);
      setTimeout(() => {
        notificationMessage.hideModeError(notificationDiv);
      }, 1000);
      // notificationMessage.hideModeError(notificationDiv);
      return
    }

    $artwork.src = `assets/img/${activeArtwork}/full/xray_after.png`;
    mode = 'xray';
    medialink = `assets/img/${activeArtwork}/details/${mode}_${selectedDetail}.png`;
    io.emit('ModeChanged', medialink);
  })
}

const infra = (activeArtwork, $artwork) => {

  const path = `./src/assets/img/${activeArtwork}/full/infra_after.png`;

  fs.access(path, fs.F_OK, (err) => {
    if (err) {
      console.log(err + 'THIS ERROR CAN BE REMOVED. JUST NEEDS TO BE A UX FRIENDLY NOTICE');
      notificationMessage.showModeError(notificationDiv);
      // notificationMessage.hideModeError(notificationDiv);
      setTimeout(() => {
        notificationMessage.hideModeError(notificationDiv);
      }, 1000);
      return
    }

    $artwork.src = `assets/img/${activeArtwork}/full/infra_after.png`;
    mode = 'infra';
    medialink = `assets/img/${activeArtwork}/details/${mode}_${selectedDetail}.png`;
    io.emit('ModeChanged', medialink);
  })
}

module.exports = { macro, xray, infra };
