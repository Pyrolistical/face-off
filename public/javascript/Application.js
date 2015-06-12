var faceOff = angular.module('face-off', []);

faceOff.controller('indexController', function($scope, $http, $q) {

  function averageWinRate(gameId, side, players) {
    $q.all(players.map(function(player) {
      return $http.get('/api/win-rate/' + player);
    })).then(function(responses) {
      var winRates = [];
      for (var i = 0; i < responses.length; i++) {
        var parsed = parseFloat(responses[i].data);
        if (!isNaN(parsed)) {
          winRates.push(parsed);
        }
      };
      var winRate = 0;
      for (var i = 0; i < winRates.length; i++) {
         winRate += winRates[i];
      };
      winRate /= winRates.length;
      $scope.games[gameId][side]['win-rate'] = winRate;
    });
  }

  $http.get('/api/games')
    .then(function(response) {
      var games = response.data;
      $scope.games = {};
      var winRates = {};
      for (var i = 0; i < games.length; i++) {
        var game = games[i];
        var participants = game.participants;
        var blueSidePlayers = [];
        var redSidePlayers = [];
        for (var j = 0; j < participants.length; j++) {
          var participant = participants[j];
          switch (participant.teamId) {
            case 100:
              blueSidePlayers.push(participant.summonerName);
              break;
            case 200:
              redSidePlayers.push(participant.summonerName);
              break;
          }
        }
        $scope.games[game.gameId] = {
          'blue-side': {
            players: blueSidePlayers,
            'win-rate': 'calculating...'
          },
          'red-side': {
            players: redSidePlayers,
            'win-rate': 'calculating...'
          },
        };
      }
      return $scope.games;
    })
    .then(function(games) {
      for (gameId in games) {
        averageWinRate(gameId, 'blue-side', games[gameId]['blue-side'].players);
        averageWinRate(gameId, 'red-side', games[gameId]['red-side'].players);
      }
    })
    .catch(function(error) {
      console.log('failed to fetch games: ' + error);
    });
});
