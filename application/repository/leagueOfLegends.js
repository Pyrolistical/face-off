var request = require('request');
var environment = require('./environment');

module.exports = {
  featuredGames: function(callback) {
    var riotApi = 'https://na.api.pvp.net';
    var featuredGamesEndpoint = '/observer-mode/rest/featured';
    var apiKeyParameter = 'api_key';
    var apiKey = environment.api.key;
    var url = riotApi + featuredGamesEndpoint + '?' + apiKeyParameter + '=' + apiKey;
    request(url, callback);
  }
};
