const 
  mongoose = require('mongoose'),
  Schema = mongoose.Schema;

module.exports = mongoose.model('Site', Schema({
  url: {
    protocol: String,    
    domain: String,
    path: String,
    full: {type: String, required: true}
  },
  parents: [Schema.ObjectId],
  children: {type: Number, default: 0},
  traversed: {type: Boolean, default: false}
}).pre('save', function(next) {
  
  console.log(this.url.full);  
  this.url.protocol = this.url.full.match(/(https?)/i)[0];
  this.url.domain = this.url.full.match(/(?::\/\/)([a-z0-9.:?\-%_=&; ]+)($|\/)/i)[1];
  let path = this.url.full.match(/(?:\.\w*)(\/.*)/i);
  if(path) this.url.path = path[1];
  else this.url.path = '';
  next();  
}));