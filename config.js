module.exports =  {
    PORT: process.env.PORT || 5000,
    //MONGODB_URL: process.env.MONGODB_URL || "mongodb://localhost/redcarpetup",
    MONGODB_URL: 'mongodb://localhost/db',
    JWT_SECRET: process.env.JWT_SECRET || 'somethingsecret'
  };