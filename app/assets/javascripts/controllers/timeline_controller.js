(function(){
  'use strict';

    angular.module('twitterApp.controllers')
     .controller('TwitterController', ['$scope', '$q' ,'twitterService', 'dataCacheService', '$sce',
      function($scope, $q, twitterService, dataCacheService, $sce) {

        $scope.cache = dataCacheService.cache;
        $scope.config = dataCacheService.userConfig;
        twitterService.initialize();

        //using the OAuth authorization result get the latest 20 tweets from twitter for the user
        $scope.refreshTimeline = function() {
            $scope.config.tweetsType = 'timeline';
            twitterService.getLatestTweets().then(function(data) {
                $scope.cache.tweets = data;
            });
        }

        //when the user clicks the connect twitter button, the popup authorization window opens
        $scope.connectButton = function() {
            twitterService.connectTwitter().then(function() {
                if (twitterService.isReady()) {
                    $scope.config.isAuthenticated = true;
                    $scope.refreshTimeline();
                }
            });
        }


        $scope.retweet = function(tweet){
            twitterService.retweetStatus(tweet.id_str).then(function(data) {
                console.log('data retweeted', data);
                tweet.retweeted = data.retweeted;
                // tweet.id = data.id;
                // tweet.id_str = data.id_str;
            });
        }

        // $scope.unretweet = function(tweet){
        //     twitterService.removeRetweet(tweet.id_str).then(function(data) {
        //         console.log('un-retweeted', data);
        //         tweet.retweeted = data.retweeted;
        //     });
        // }

        $scope.highlight = function(text, search) {
          if (!search) {
              return $sce.trustAsHtml(text);
          }
          return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<span class="highlightedText">$&</span>'));
        };

        //if the user is a returning user, hide the sign in button and display the tweets
        if (twitterService.isReady()) {
            $scope.config.isAuthenticated = true;
            $scope.refreshTimeline();
        }

    }]);

})();
