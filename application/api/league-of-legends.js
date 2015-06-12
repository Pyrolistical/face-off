// module that makes raw league of legends api calls

var request = require('request');
var limiter = require('rate-limit');
var environment = require('../environment');

var riotApi = 'https://na.api.pvp.net';
var apiKeyParameter = 'api_key';
var apiKey = environment.api.key;

function parameter(key, value) {
  return key + '=' + value;
}

function url(endpoint) {
  console.log('api request: ' + endpoint);
  return riotApi + endpoint + '?' + parameter(apiKeyParameter, apiKey);
}

// request every 3 milliseconds when using a production key
var queue = limiter.createQueue({interval: 3});

function queueRequest(url, callback) {
  function performRequest() {
    request(url, callback);
  }
  queue.add(performRequest);
}

module.exports = {
  featuredGames: function(callback) {
    queueRequest(url('/observer-mode/rest/featured'), callback);
  },

  summonerByName: function(name, callback) {
    queueRequest(url('/api/lol/na/v1.4/summoner/by-name/' + name), callback);
  },

  matchHistory: function(summonerId, callback) {
    queueRequest(url('/api/lol/na/v2.2/matchhistory/' + summonerId), callback);
  }
};
