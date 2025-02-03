const path = require('path');
// const os = require('os');

const getJs = async (req, res) => {
  // const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  res.sendFile(path.join(__dirname, './createIframe.js'));
};

module.exports = getJs;
