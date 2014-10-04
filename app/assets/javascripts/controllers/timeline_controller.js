(function(){
  'use strict';

    angular.module('twitterApp.controllers')
     .controller('TwitterController', ['$scope', '$q' ,'twitterService', function($scope, $q, twitterService) {

        $scope.tweets;
        $scope.isAuthenticated = false;
        twitterService.initialize();

        //using the OAuth authorization result get the latest 20 tweets from twitter for the user
        $scope.refreshTimeline = function() {
            $scope.tweetsType = 'timeline';
            twitterService.getLatestTweets().then(function(data) {
                $scope.tweets = data;
            });
        }

        $scope.searchTwitter = function() {
            $scope.tweetsType = 'search';
            twitterService.getRelatedTweets($scope.searchTerm).then(function(data) {
                $scope.tweets = data;
            });
        }

        //when the user clicks the connect twitter button, the popup authorization window opens
        $scope.connectButton = function() {
            twitterService.connectTwitter().then(function() {
                if (twitterService.isReady()) {
                    $scope.isAuthenticated = true;
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

        //sign out clears the OAuth cache, the user will have to reauthenticate when returning
        $scope.signOut = function() {
            twitterService.clearCache();
            $scope.tweets.length = 0;
            $scope.isAuthenticated = false;
            // $('#getTimelineButton, #signOut').fadeOut(function(){
            //     $('#connectButton').fadeIn();
            // });
        }

        //if the user is a returning user, hide the sign in button and display the tweets
        if (twitterService.isReady()) {
            $scope.isAuthenticated = true;
            $scope.refreshTimeline();
        }

    }]);

})();
