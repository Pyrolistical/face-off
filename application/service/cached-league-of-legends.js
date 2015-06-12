// module caches league of legends api calls

var api = require('../api/league-of-legends');
var cache = require('../models/league-of-legends-cache');

function refreshFeaturedGames(cached, callback) {
  api.featuredGames(function(error, response, body) {
    if (error) {
      callback(error, null);
    } else if (response.statusCode == 200){
      cached.latest = JSON.parse(body);
      cached.updated = new Date();
      cached.save(function(saveError, success) {
        if (saveError) {
          callback(saveError, null);
        } else {
          callback(null, success.latest);
        }
      });
    } else {
      callback('unexpected response code: ' + response.statusCode, null);
    }
  });
}

function refreshMatchHistory(cached, callback) {
  api.matchHistory(cached.id, function(error, response, body) {
    if (error) {
      callback(error, null);
    } else if (response.statusCode == 200){
      var rawMatchHistory = JSON.parse(body);
      if (Object.keys(rawMatchHistory).length === 0) {
        rawMatchHistory.matches = [];
      }
      for (var i = 0; i < rawMatchHistory.matches.length; i++) {
        var match = rawMatchHistory.matches[i];
        var matchId = match.matchId;
        var won = match.participants[0].stats.winner;
        cached.matches[matchId] = won;
      }
      cached.updated = new Date();
      cached.save(function(saveError, success) {
        if (saveError) {
          callback(saveError, null);
        } else {
          callback(null, success);
        }
      });
    } else {
      callback('unexpected response code: ' + response.statusCode, null);
    }
  });
}

module.exports = {
  featuredGames: function(callback) {
    cache.FeaturedGames.findOne({name: 'latest'}).exec(function(cacheError, cached) {
      if (cacheError) {
        callback(cacheError, null);
      } else if (cached === null) {
        var newCached = new cache.FeaturedGames({name: 'latest'});
        refreshFeaturedGames(newCached, callback);
      } else {
        var refreshRate = cached.latest.clientRefreshInterval;
        var nextUpdate = cached.updated;
        nextUpdate.setTime(nextUpdate.getTime() + 1000*refreshRate);
        if (nextUpdate < new Date()) {
          refreshFeaturedGames(cached, callback);
        } else {
          callback(null, cached.latest);
        }
      }
    });
  },

  summonerByName: function(name, callback) {
    cache.Summoners.findOne({name: name}).exec(function(cacheError, cached) {
      if (cacheError) {
        callback(cacheError, null);
      } else if (cached === null) {
        api.summonerByName(name, function(error, response, body) {
          if (error) {
            callback(error, null);
          } else if (response.statusCode == 200) {
            var summoners = JSON.parse(body);
            summoner = summoners[Object.keys(summoners)[0]];
            new cache.Summoners(summoner).save(function(saveError, summoner) {
              if (saveError) {
                callback(saveError, null);
              } else {
                callback(null, summoner);
              }
            });
          } else {
            callback('unexpected response code: ' + response.statusCode, null);
          }
        });
      } else {
        callback(null, cached);
      }
    });
  },

  matchHistory: function(summonerId, callback) {
    cache.MatchHistories.findOne({id: summonerId}).exec(function(cacheError, cached) {
      if (cacheError) {
        callback(cacheError, null);
      } else if (cached === null) {
        var newCached = new cache.MatchHistories({id: summonerId, matches: {}});
        refreshMatchHistory(newCached, callback);
      } else {
        var refreshRate = 4*60*60;
        var nextUpdate = cached.updated;
        nextUpdate.setTime(nextUpdate.getTime() + 1000*refreshRate);
        if (nextUpdate < new Date()) {
          refreshMatchHistory(cached, callback);
        } else {
          callback(null, cached);
        }
      }
    });
  }
};
