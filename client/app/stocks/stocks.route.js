(function () {
  'use strict';

  angular
    .module('app.stocks')
    .run(appRun);

  appRun.$inject = ['routerHelper'];

  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'stock',
        config: {
          absract: true,
          template: '<ui-view class="shuffle-animation"/>',
          url: '/stock'
        }
      },
      {
        state: 'stock.detail',
        config: {
          url: '/:id',
          templateUrl: 'app/stocks/stocks-details.html',
          controller: 'StocksCtrl',
          controllerAs: 'pm',
          title: 'Stock Details',
          settings: {
            nav: 2,
            content: '<i class="fa fa-group"></i> Stocks'
          }
        }
      }
    ];
  }
})();
