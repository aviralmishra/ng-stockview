(function () {
  'use strict';

  var core = angular.module('app.core');

  core.config(toastrConfig);
  toastrConfig.$inject = ['toastr'];

  /* @ngInject */
  function toastrConfig(toastr) {
    toastr.options.timeOut = 2000;
    toastr.options.positionClass = 'toast-bottom-right';
  }

  var config = {
    appErrorPrefix: '[StockView Error] ',
    appTitle: 'StockView'
  };

  core.value('config', config);

  core.config(configure);

  configure.$inject = ['$compileProvider', '$logProvider',
    'routerHelperProvider', 'exceptionHandlerProvider'];

  /* @ngInject */
  function configure($compileProvider, $logProvider,
    routerHelperProvider, exceptionHandlerProvider) {
    $compileProvider.debugInfoEnabled(false);

    // turn debugging off/on (no info or warn)
    if ($logProvider.debugEnabled) {
      $logProvider.debugEnabled(true);
    }
    exceptionHandlerProvider.configure(config.appErrorPrefix);
    configureStateHelper();

    function configureStateHelper() {
      var resolveAlways = {
        ready: ready
      };

      ready.$inject = ['stocksService'];
      function ready(stocksService) {
        return stocksService.ready();
      }

      routerHelperProvider.configure({
        docTitle: 'StockView: ',
        resolveAlways: resolveAlways
      });
    }
  }
})();
