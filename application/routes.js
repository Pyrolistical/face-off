var api = require('./service/cached-league-of-legends');
var stats = require('./service/league-of-legends-stats');

module.exports = function(application) {

  application.get('/api/games', function(request, response) {
    api.featuredGames(function(error, latest) {
      if (error) {
        response.send(error);
      } else {
        response.type('application/json');
        response.send(latest.gameList);
      }
    });
  });

  application.get('/api/win-rate/:summonerName', function(request, response) {
    stats.winRate(request.params['summonerName'], function(error, winRate) {
      if (error) {
        response.send(error);
      } else {
        response.type('plain/text');
        response.send(winRate.toString());
      }
    });
  });

  application.get('/', function(request, response) {
      response.sendfile('./public/views/index.html');
  });

};
