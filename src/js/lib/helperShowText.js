const idle = () => {
  console.log(allData[activeArtwork]["idle_text"]);
  what = allData[activeArtwork]["idle_text"][activeLanguage]["what"];
  artworkTitle = allData[activeArtwork]["title"][activeLanguage];
  artworkYear = allData[activeArtwork]["details"]["year"];
  help = allData[activeArtwork]["idle_text"][activeLanguage]["help"];
  io.emit('Idle', what, artworkTitle, artworkYear, help);
}

const didYouKnows = () => {
  console.log('didYouKnow', didYouKnow);
  console.log('didYouKnow[activeLanguage]', didYouKnow[activeLanguage]);
  const randomNumber = Math.floor(Math.random() * Object.keys(didYouKnow[activeLanguage]).length);
  console.log(randomNumber);
  const extrainfo = didYouKnow[activeLanguage][randomNumber];
  io.emit('didyouknow', extrainfo);
}

module.exports = { idle, didYouKnows };
