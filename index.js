// Require libraries
const 
  mongoose = require('mongoose')
  crawler = require('./crawler');

mongoose.connect('mongodb://localhost/spiderman');
mongoose.connection.on('open', () => {
  console.log(`Database connected`);

  crawler.crawl('https://github.com/', () => {
    mongoose.connection.close();
  });
});