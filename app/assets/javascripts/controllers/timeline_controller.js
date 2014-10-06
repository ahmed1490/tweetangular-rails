(function(){
  'use strict';

    angular.module('twitterApp.controllers')
     .controller('TwitterController', ['$scope', '$q' ,'twitterService', 'dataCacheService', '$sce',
      function($scope, $q, twitterService, dataCacheService, $sce) {

        $scope.cache = dataCacheService.cache;
        $scope.config = dataCacheService.userConfig;
        $scope.loadingTweets = true;
        twitterService.initialize();

        //using the OAuth authorization result get the latest 20 tweets from twitter for the user
        $scope.refreshTimeline = function() {
          if( $scope.config.tweetsType == 'timeline' &&  $scope.cache.tweets.length > 0 ){
            var newest_id = $scope.cache.tweets[0].id_str;
            $scope.loadingTweets = true;
            twitterService.getTimelineTweets({since_id: newest_id}).then(function(tweets_arr) {
              if( tweets_arr.length>0 ){
                tweets_arr.push.apply(tweets_arr, $scope.cache.tweets);
                $scope.cache.tweets = tweets_arr;
              }
              else{
                alert('No new tweets yet@')
              }
              $scope.loadingTweets = false;
            });
          }
          else{
            $scope.config.tweetsType = 'timeline';
            $scope.loadingTweets = true;
            twitterService.getTimelineTweets().then(function(data) {
                $scope.cache.tweets = data;
                $scope.loadingTweets = false;
            });
          }
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

        $scope.moreTweets = function() {
            var oldest_id = $scope.cache.tweets[$scope.cache.tweets.length - 1].id_str;
            if($scope.config.tweetsType == 'timeline'){
                $scope.loadingMoreTweets = true;
                twitterService.getTimelineTweets({max_id: oldest_id}).then(function(tweets_arr) {
                    $scope.cache.tweets.push.apply($scope.cache.tweets, tweets_arr);
                    $scope.loadingMoreTweets = false;
                });
            }
            else if($scope.config.tweetsType == 'search'){
              $scope.loadingMoreTweets = true;
              twitterService.getRelatedTweets($scope.config.searchTerm, {max_id: oldest_id}).then(function(tweets_arr) {
                  $scope.cache.tweets.push.apply($scope.cache.tweets, tweets_arr);
                  $scope.loadingMoreTweets = false;
              });
            }
        }


        $scope.retweet = function(tweet){
            twitterService.retweetStatus(tweet.id_str).then(function(data) {
                tweet.retweeted = data.retweeted;
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
