const messagesID = document.querySelector('#messages');
let data = [];
let currentArtwork = 0;


(() => {

  fetch('./assets/data/Artworks.json', {
    headers : {
     'Content-Type': 'application/json',
     'Accept': 'application/json'
    }
  })

  .then(response => response.json())
  .then(results => {
    data = results;
    console.log(data);

  }).catch((e => console.log(e)));
  return

  const socket = io();

  socket.on('artwork', (msg) => {

  })

  socket.on('button pressed', (msg) => {
    const node = document.createElement('li');
    const textNode = document.createTextNode(msg);
    node.appendChild(textNode);
    messagesID.appendChild(node);

    window.scrollTo(0, document.body.scrollHeight);
  });

  socket.on('potentiometer turn', (msg) => {

    const node = document.createElement('li');
    const textNode = document.createTextNode(msg);
    node.appendChild(textNode);
    messagesID.appendChild(node);

    window.scrollTo(0, document.body.scrollHeight);
  });


})();
