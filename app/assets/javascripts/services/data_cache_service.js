(function(){
  'use strict';

  angular.module('twitterApp.services')
   .factory('dataCacheService', function($q) {

    var exports = {}
    exports.cache = { tweets: [] };

    exports.userConfig = {
      isAuthenticated: false,
      tweetsType: 'timeline',
      searchTerm: ''
    };

    return exports;
  });

})();
