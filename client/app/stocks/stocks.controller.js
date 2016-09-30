(function () {
  'use strict';

  angular
    .module('app.stocks')
    .controller('StocksCtrl', StocksCtrl);

  StocksCtrl.$inject = ['$state', '$stateParams', '$window', 'stocksService', 'logger'];

  /* @ngInject */
  function StocksCtrl($state, $stateParams, $window, stocksService, logger) {
    var vm = this;
    var stockSymbol = $state.symbol;

    vm.stocks = [];
    vm.stock = {};

    vm.title = 'Stock Details';
    vm.goBack = goBack;

    activate();

    function activate() {
      return getStock().then(function () {
        logger.info('Activated Stock Details View');
      });
    }

    function getStock() {
      return stocksService.getStock($stateParams.id).then(function (data) {
        vm.stock = data;
        return vm.stock;
      });
    }

    function goBack() {
      $window.history.back();
    }
  }
})();
