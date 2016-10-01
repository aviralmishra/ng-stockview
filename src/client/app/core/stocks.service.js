(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('stocksService', stocksService);

  stocksService.$inject = ['$http', '$location', '$q', 'exception', 'logger'];

  /* @ngInject */
  function stocksService($http, $location, $q, exception, logger) {
    var readyPromise;

    var service = {
      getStock: getStock,
      getStocks: getStocks,
      ready: ready
    };

    return service;

    function getStock(id) {
      return $http.get('http://localhost:4000/api/stock/' + id)
        .then(getStockComplete)
        .catch(function (message) {
          exception.catcher('XHR Failed for getStock')(message);
          $location.url('/');
        });

      function getStockComplete(data, status, headers, config) {
        return data.data;
      }
    }

    function getStocks() {
      return $http.get('http://localhost:4000/api/stocks')
        .then(getStocksComplete)
        .catch(function (message) {
          exception.catcher('XHR Failed for getStocks')(message);
          $location.url('/');
        });

      function getStocksComplete(data, status, headers, config) {
        return data.data;
      }
    }

    function getReady() {
      if (!readyPromise) {
        // Prime the app
        logger.info('Primed the app data');
        readyPromise = $q.when(service);
      }
      return readyPromise;
    }

    function ready(promisesArray) {
      return getReady()
        .then(function () {
          return promisesArray ? $q.all(promisesArray) : readyPromise;
        }).catch(exception.catcher('"ready" function failed'));
    }
  }
})();
