(function () {
  'use strict';

  angular
    .module('app.stocks')
    .controller('StocksCtrl', StocksCtrl);

  StocksCtrl.$inject = ['$state', '$stateParams', '$window', 'stocksService', 'logger'];

  /* @ngInject */
  function StocksCtrl($state, $stateParams, $window, stocksService, logger) {
    var pm = this;
    var stockSymbol = $state.symbol;

    pm.stocks = [];
    pm.stock = {};

    pm.title = 'Stock Details';
    pm.goBack = goBack;

    activate();

    function activate() {
      return getStock().then(function () {
        logger.info('Activated Stock Details View');
      });
    }

    function getStock() {
      return stocksService.getStock($stateParams.id).then(function (data) {
        pm.stock = data;
        return pm.stock;
      });
    }

    function goBack() {
      $window.history.back();
    }
  }
})();
