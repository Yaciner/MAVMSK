const helperShowText = require('./helperShowText');

const change = () => {
  if (activeLanguage !== previousLanguage) {
    previousLanguage = activeLanguage;
    console.log(activeLanguage);
    detailTitle = allData[activeArtwork]["details"][activeLanguage][selectedDetail].title;
    detailInfo = allData[activeArtwork]["details"][activeLanguage][selectedDetail].info;
    activeArtworkTranslate = allData[activeArtwork]['title'][activeLanguage];

    medialink = `/assets/img/${activeArtwork}/details/${mode}_${selectedDetail}.png`;
    console.log(selectedLanguage);

    what = allData[activeArtwork]["idle_text"][activeLanguage]["what"];
    artworkTitle = allData[activeArtwork]["title"][activeLanguage];
    artworkYear = allData[activeArtwork]["details"]["year"];
    help = allData[activeArtwork]["idle_text"][activeLanguage]["help"];
    io.emit('LanguageChange', activeArtworkTranslate, detailTitle, detailInfo, what, artworkTitle, artworkYear, help, medialink);
    helperShowText.didYouKnows(io)
  }
}

module.exports = { change };
