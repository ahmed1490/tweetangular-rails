(function(){
  'use strict';

  angular.module('twitterApp.services')
   .factory('twitterService',['$q', function($q) {

    var authorizationResult = false;

    var exports = {
      initialize: function() {
          //initialize OAuth.io with public key of the application
          OAuth.initialize('1VJ_dky1jmZfvXL2eNi5m22LmOQ', {cache:true});
          //try to create an authorization result when the page loads, this means a returning user won't have to click the twitter button again
          authorizationResult = OAuth.create('twitter');

          //OAuth.callback('twitter');
      },
      isReady: function() {
          return (authorizationResult);
      },
      connectTwitter: function() {
          var deferred = $q.defer();
          OAuth.popup('twitter', {cache:true}, function(error, result) { //cache means to execute the callback if the tokens are already present
              if (!error) {
                  authorizationResult = result;
                  deferred.resolve();
              } else {
                  alert("Something went wrong while connecting to twitter. Please refresh and try again!");
              }
          });
          return deferred.promise;
      },

      clearCache: function() {
          OAuth.clearCache('twitter');
          authorizationResult = false;
      },

      getLoggedInUserInfo: function(){
        var deferred = $q.defer();
        authorizationResult.me().done(function(data){
          deferred.resolve(data);
        });
        return deferred.promise;
      },

      getTimelineTweets: function (opts) {
          var url = '/1.1/statuses/home_timeline.json?'+getQueryParams(opts);
          var deferred = $q.defer();
          var promise = authorizationResult.get(url).done(function(data) {
              deferred.resolve(data);
          });
          return deferred.promise;
      },
      getRelatedTweets: function (search_term, opts) {
          var url = '/1.1/search/tweets.json?q='+encodeURIComponent(search_term)+'&'+getQueryParams(opts);
          var deferred = $q.defer();
          var promise = authorizationResult.get(url).done(function(data) {
              deferred.resolve(data.statuses)
          });
          return deferred.promise;
      },
      retweetStatus: function (tweet_id) {
        var deferred = $q.defer();
        var promise = authorizationResult.post('/1.1/statuses/retweet/'+tweet_id+'.json').done(function(data) {
            deferred.resolve(data)
        });
        return deferred.promise;
      }//,

      // removeRetweet: function (tweet_id) {
      //   var deferred = $q.defer();
      //   exports.getUserRetweetStatusId(tweet_id).then(function(data){
      //     exports.removeStatus(data.id_str).then(function(new_data){
      //       deferred.resolve(new_data);
      //     });
      //   });
      //   return deferred.promise;
      // },

      // getUserRetweetStatusId: function(original_tweet_id){
      //   var deferred = $q.defer();
      //   // authorizationResult.get('1.1/statuses/retweets/'+original_tweet_id+'.json').done(function(retweets){
      //   //   console.log(retweets);
      //   // })

      //   $q.all([
      //      exports.getUserData(),
      //      authorizationResult.get('1.1/statuses/retweets/'+original_tweet_id+'.json')
      //   ]).then(function(data) {
      //      var userData = data[0];
      //      var statusRetweets = data[1];
      //      $deferred.resolve(statusRetweets[i].id_str)
      //   });

      //   return deferred.promise;
      // },

      // removeStatus: function (tweet_id) {
      //   var deferred = $q.defer();
      //   var promise = authorizationResult.del('1.1/statuses/destroy/'+tweet_id+'.json').done(function(data) {
      //       deferred.resolve(data)
      //   });
      //   return deferred.promise;
      // },

      // getUserData: function(){
      //   var deferred = $q.defer();
      //   if( typeof(userData) === 'undefined' ){
      //     authorizationResult.me().done(function(data){
      //       userData = data;
      //       deferred.resolve(data);
      //     });
      //   }
      //   else{
      //     deferred.resolve(userData);
      //   }
      //  return deferred.promise;
      // }
    }

    function getQueryParams(opts){
      opts = opts || {};
      if(opts.max_id)
        return 'max_id=' + String(parseInt(opts.max_id)-1);
      else if(opts.since_id)
        return 'since_id=' + String(opts.since_id);
      return '';
    }

    exports.tweetCache = [];
    return exports;

  }]);

})();
