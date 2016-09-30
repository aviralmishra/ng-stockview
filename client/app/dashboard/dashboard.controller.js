(function () {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('Dashboard', Dashboard);

  Dashboard.$inject = ['$state', 'stocksService', 'logger'];

  function Dashboard($state, stocksService, logger) {
    var vm = this;
    vm.stocks = [];
    vm.gotoStock = gotoStock;
    vm.title = 'Dashboard';

    activate();

    function activate() {
      return getStocks().then(function () {
        logger.info('Activated Dashboard');
      });
    }

    function getStocks() {
      return stocksService.getStocks().then(function (data) {
        vm.stocks = data;
        return vm.stocks;
      });
    }

    function gotoStock(stockSymbol) {
      $state.go('stock.detail', {id: stockSymbol});
    }
  }
})();
