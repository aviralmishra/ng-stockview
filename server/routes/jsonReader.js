module.exports = function () {
  var service = {
    readFile: readFile
  };
  return service;

  function readFile(file) {
    var fs = require('fs');
    var json = getConfig(file);
    return json;

    function readFileSync(filepath, encoding) {
      if (typeof (encoding) === 'undefined') {
        encoding = 'utf8';
      }
      var file = fs.readFileSync(filepath, encoding);
      return JSON.parse(file);
    }

    function getConfig(file) {
      var filepath = __dirname + file;
      return readFileSync(filepath);
    }
  }
};
