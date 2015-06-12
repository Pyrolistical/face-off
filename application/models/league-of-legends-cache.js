var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = {
  FeaturedGames: mongoose.model('FeaturedGames', new Schema({
    name: {
      type: String
    },
    latest: {
      type: Schema.Types.Mixed
    },
    updated: {
      type: Date
    }
  })),
  Summoners: mongoose.model('Summoners', new Schema({
    name: {
      type: String
    },
    id: {
      type: Number
    }
  })),
  MatchHistories: mongoose.model('MatchHistories', new Schema({
    matches: {
      type: Schema.Types.Mixed
    },
    id: {
      type: Number
    },
    updated: {
      type: Date
    }
  }))
};
