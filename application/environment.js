module.exports = {
  server: {
    port: process.env.PORT || 8080
  },
  
  database: {
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASSWORD
  },

  api: {
    key: process.env.API_KEY
  }
};
