(function () {
  'use strict';

  angular
    .module('app.layout')
    .directive('htTopNav', htTopNav);

  /* @ngInject */
  function htTopNav() {
    var directive = {
      bindToController: true,
      controller: TopNavController,
      controllerAs: 'pm',
      restrict: 'EA',
      scope: {
        'tagline': '=',
        'title': '='
      },
      templateUrl: 'app/layout/ht-top-nav.html'
    };

    /* @ngInject */
    function TopNavController() {
      var pm = this;
    }

    return directive;
  }
})();
