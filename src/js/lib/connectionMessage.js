const show = (div, ip, port) => {
  div.textContent = `Connect to ${ip}:${port}`;
  div.classList.remove('translate-down');
}

const hide = (div) => {
  div.textContent = `Connected!`;
  div.classList.add('translate-down');
}

module.exports = { show, hide };
