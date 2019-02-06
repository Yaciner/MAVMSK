const show = (div, ip, port) => {
  div.textContent = `Surf to ${ip}:${port}`;
}

const hide = (div) => {
  div.style.display = 'none';
}

module.exports = { show, hide };
