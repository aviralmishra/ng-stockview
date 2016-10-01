(function () {
  'use strict';

  angular
    .module('app.core', [
      /* Angular modules */
      'ngAnimate',
      'ngSanitize',

      /* Cross-app modules */
      'common.exception',
      'common.logger',
      'common.router',

      /* 3rd-party modules */
      'ui.router',
      'ngplus'
    ]);

})();
