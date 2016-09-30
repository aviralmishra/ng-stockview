(function () {
  'use strict';

  angular
    .module('common.exception')
    .provider('exceptionHandler', exceptionHandlerProvider)
    .config(config);

  function exceptionHandlerProvider() {
    /* jshint validthis:true */
    this.config = {
      appErrorPrefix: undefined
    };

    this.configure = function (appErrorPrefix) {
      this.config.appErrorPrefix = appErrorPrefix;
    };

    this.$get = function () {
      return {config: this.config};
    };
  }

  config.$inject = ['$provide'];

  function config($provide) {
    $provide.decorator('$exceptionHandler', extendExceptionHandler);
  }

  extendExceptionHandler.$inject = ['$delegate', 'exceptionHandler', 'logger'];

  /* @ngInject */
  function extendExceptionHandler($delegate, exceptionHandler, logger) {
    return function (exception, cause) {
      var appErrorPrefix = exceptionHandler.config.appErrorPrefix || '';
      var errorData = {exception: exception, cause: cause};

      exception.message = appErrorPrefix + exception.message;
      $delegate(exception, cause);

      /** Can also throw this exception with throw {message: exception.message}; */
      logger.error(exception.message, errorData);
    };
  }
})();
