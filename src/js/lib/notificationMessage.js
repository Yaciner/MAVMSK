const showConnect = (div, ip, port) => {
  div.textContent = `Connect to ${ip}:${port}`;
  div.classList.remove('translate-down');
}

const hideConnect = (div) => {
  div.textContent = `Connected!`;
  div.classList.add('translate-down');
}

const showModeError = (div) => {
  div.textContent = errors[activeLanguage];
  div.classList.remove('translate-down');

}

const hideModeError = (div) => {
  div.classList.add('translate-down');
}

const hideNotificationWindow = (div) => {
  div.classList.add('translate-down');
}

module.exports = { showConnect, hideConnect, showModeError, hideModeError, hideNotificationWindow };
