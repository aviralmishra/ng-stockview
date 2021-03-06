(function () {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('Dashboard', Dashboard);

  Dashboard.$inject = ['$state', 'stocksService', 'logger'];

  function Dashboard($state, stocksService, logger) {
    var pm = this;
    pm.stocks = [];
    pm.gotoStock = gotoStock;
    pm.title = 'Dashboard';

    activate();

    function activate() {
      return getStocks().then(function () {
        logger.info('Activated Dashboard');
      });
    }

    function getStocks() {
      return stocksService.getStocks().then(function (data) {
        pm.stocks = data;
        return pm.stocks;
      });
    }

    function gotoStock(stockSymbol) {
      $state.go('stock.detail', {id: stockSymbol});
    }
  }
})();
