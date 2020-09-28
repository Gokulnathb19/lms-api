var mongoose = require('mongoose')
var config = require('./config');
const {MONGODB_URL: dbUrl} = config;

module.exports.connect = () => {
    mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(()=> console.log('MongoDB connected Successfully'))
  .catch((error) => console.log('Error:',error.reason));
}