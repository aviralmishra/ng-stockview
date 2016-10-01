(function () {
  'use strict';

  angular
    .module('app.layout')
    .controller('LandPage', LandPage);

  LandPage.$inject = ['$timeout', 'config', 'logger'];

  /* @ngInject */
  function LandPage($timeout, config, logger) {
    var pm = this;

    pm.title = config.appTitle;
    pm.busyMessage = 'Please wait ...';
    pm.isBusy = true;
    pm.showSplash = true;

    activate();

    function activate() {
      logger.success(config.appTitle + ' loaded!', null);
      hideSplash();
    }

    function hideSplash() {
      $timeout(function () {
        pm.showSplash = false;
      }, 1000);
    }
  }
})();
