module.exports = function (app) {
  var api = '/api';
  var data = '/../data/';
  var jsonReader = require('./jsonReader')();

  app.get(api + '/stock/:symbol', getStock);
  app.get(api + '/stocks', getStocks);

  function getStock(req, res, next) {
    var stocks = jsonReader.readFile(data + 'stocks.json');

    var stock = stocks.filter(function (s) {
      return s.symbol === req.params.symbol;
    });
    res.send(stock[0]);
  }

  function getStocks(req, res, next) {
    var stocks = jsonReader.readFile(data + 'stocks.json');
    res.send(stocks);
  }
};
