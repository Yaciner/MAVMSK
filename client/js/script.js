const messagesID = document.querySelector('#messages');

(() => {
  const socket = io();

  socket.on('button pressed', function(msg){

    const node = document.createElement('li');
    const textNode = document.createTextNode(msg);
    node.appendChild(textNode);
    messagesID.appendChild(node);

    window.scrollTo(0, document.body.scrollHeight);
  });
})();
