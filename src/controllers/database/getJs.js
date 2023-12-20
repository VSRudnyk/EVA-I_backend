const path = require('path');

const getJs = async (req, res) => {
  res.sendFile(path.join(__dirname, './createIframe.js'));
};

module.exports = getJs;
