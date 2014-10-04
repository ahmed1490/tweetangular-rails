(function(){
  'use strict';

  angular.module('twitterApp.directives')
   .directive('tweet',function() {
    return {
      restrict: 'E',
      templateUrl: 'tweetItem.html'
    };
  });

})();
