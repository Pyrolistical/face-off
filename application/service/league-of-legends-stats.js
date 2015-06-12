var cache = require('./cached-league-of-legends');

module.exports = {
  winRate: function(summonerName, callback) {
    cache.summonerByName(summonerName, function(summonerError, summoner) {
      if (summonerError) {
        callback(null, 0);
      } else {
        cache.matchHistory(summoner.id, function(matchHistoryError, matchHistory) {
          if (matchHistoryError) {
            callback(matchHistoryError, null);
          } else {
            var totalMatches = 0;
            var wins = 0;
            for (match in matchHistory.matches) {
              totalMatches++;
              if (matchHistory.matches[match]) {
                wins++;
              }
            }
            callback(null, wins/totalMatches);
          }
        });
      }
    });
  }
};
