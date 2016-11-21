const 
  mongoose = require('mongoose'),
  Schema = mongoose.Schema;

module.exports = mongoose.model('Site', Schema({
  url: String,
  parents: [Schema.ObjectId],
  children: {type: Number, default: 0},
  traversed: {type: Boolean, default: false}
}));