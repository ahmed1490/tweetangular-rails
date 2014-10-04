(function(){
  'use strict';

    angular.module('twitterApp.controllers')
     .controller('MenuController', ['$scope', '$q' ,'twitterService', 'dataCacheService',
      function($scope, $q, twitterService, dataCacheService) {

        $scope.cache = dataCacheService.cache;
        $scope.config = dataCacheService.userConfig;

        $scope.searchTwitter = function() {
            $scope.config.tweetsType = 'search';
            if( $scope.config.searchTerm.length > 0 ){
              twitterService.getRelatedTweets($scope.config.searchTerm).then(function(data) {
                  $scope.cache.tweets = data;
              });
            }
            else{
              $scope.config.tweetsType = 'timeline';
              twitterService.getLatestTweets().then(function(data) {
                  $scope.cache.tweets = data;
              });
            }
        }


        //sign out clears the OAuth cache, the user will have to reauthenticate when returning
        $scope.signOut = function() {
            twitterService.clearCache();
            $scope.cache.tweets.length = 0;
            $scope.config.isAuthenticated = false;
        }

    }]);

})();
