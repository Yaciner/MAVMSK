const idle = () => {
  what = allData[activeArtwork]["idle_text"][activeLanguage]["what"];
  artworkTitle = allData[activeArtwork]["title"][activeLanguage];
  artworkYear = allData[activeArtwork]["details"]["year"];
  help = allData[activeArtwork]["idle_text"][activeLanguage]["help"];
  io.emit('Idle', what, artworkTitle, artworkYear, help);
}

const didYouKnows = () => {
  const randomNumber = Math.floor(Math.random() * Object.keys(didYouKnow[activeLanguage]).length);
  const extrainfo = didYouKnow[activeLanguage][randomNumber];
  io.emit('didyouknow', extrainfo);
}

module.exports = { idle, didYouKnows };
