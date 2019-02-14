const clear = ($artwork) => {
  $artwork.style.transform = `scale(1)`;
  $artwork.style.transform += `translate(0)`;
}

const apply = ($artwork) => {
  $artwork.style.transform = `scale(${allData[activeArtwork]['coordinates'][selectedDetail].s})`;
  $artwork.style.transform += `translate(${allData[activeArtwork]['coordinates'][selectedDetail].x + ',' + allData[activeArtwork]['coordinates'][selectedDetail].y})`;
}

const into = ($artwork, io) => {
  isZoomedIn = true;
  apply($artwork);

  title = allData[activeArtwork]["details"][activeLanguage][selectedDetail].title;
  info = allData[activeArtwork]["details"][activeLanguage][selectedDetail].info;
  activeArtworkTranslate = allData[activeArtwork]['title'][activeLanguage];
  medialink = `assets/img/${activeArtwork}/details/${mode}_${selectedDetail}.png`;
  activeLanguage = languages[selectedLanguage];
    document.querySelectorAll('.indicator').forEach($indicator => {
      $indicator.style.opacity = '0';

    })
  io.emit('Zoom', title, info, activeArtworkTranslate, medialink);
}

const out = ($artwork, io) => {
  clearInterval(zoomTimer);
  isZoomedIn = false;
  clear($artwork);
  document.querySelectorAll('.indicator').forEach($indicator => {
    $indicator.style.opacity = '1';
  })
  document.querySelector('.indicator--information').innerText = '';

  what = allData[activeArtwork]["idle_text"][activeLanguage]["what"];
  artworkTitle = allData[activeArtwork]["title"][activeLanguage];
  artworkYear = allData[activeArtwork]["details"]["year"];
  help = allData[activeArtwork]["idle_text"][activeLanguage]["help"];
  io.emit('Idle', what, artworkTitle, artworkYear, help);
}

module.exports = { clear, apply, into, out };
