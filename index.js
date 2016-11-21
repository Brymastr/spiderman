// Require libraries
const 
  mongoose = require('mongoose')
  crawler = require('./crawler'),
  Site = require('./site');

mongoose.connect('mongodb://localhost/spiderman');
mongoose.connection.on('open', () => {
  console.log(`Database connected`);

  Site.remove({}, () => {
    new Site({url: 'https://github.com/'}).save((err, doc) => {
      crawler.crawl(result => {
        console.log(result);
        mongoose.connection.close();
      });
    });
  });
});