var proxyquire = require('proxyquire');
var assert = require('assert');

function givenSomeSummoner(mockedCache) {
  mockedCache.summonerByName = function(summonerName, callback) {
    callback(null, {
      id: 9999
    });
  };
}

function givenMissingSummoner(mockedCache) {
  mockedCache.summonerByName = function(summonerName, callback) {
    callback('not found', null);
  };
}

function givenAMatchHistoryOf(mockedCache, matches) {
  mockedCache.matchHistory = function(summonerId, callback) {
    callback(null, {
      matches: matches
    });
  };
}

function shouldCalculateWinRateForValidSummoner() {
  var mockedCache = {};

  var stats = proxyquire('../application/service/league-of-legends-stats', {
    './cached-league-of-legends': mockedCache
  });

  givenSomeSummoner(mockedCache);
  givenAMatchHistoryOf(mockedCache, [false, true, false, false]);

  stats.winRate('Fred', function(error, winRate) {
    assert(!error, 'expected success');
    assert.equal(winRate, 0.25, 'expected 0.25 win rate');
  });
}

function shouldDefaultWinRateToZeroForInvalidSummoner() {
  var mockedCache = {};

  var stats = proxyquire('../application/service/league-of-legends-stats', {
    './cached-league-of-legends': mockedCache
  });

  givenMissingSummoner(mockedCache);

  stats.winRate('Fred', function(error, winRate) {
    assert(!error, 'expected success');
    assert.equal(winRate, 0, 'expected 0 win rate');
  });
}

shouldCalculateWinRateForValidSummoner();
shouldDefaultWinRateToZeroForInvalidSummoner();
