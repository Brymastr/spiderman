// Require libraries
const 
  mongoose = require('mongoose')
  crawler = require('./crawler'),
  Site = require('./site');

mongoose.connect('mongodb://localhost/spiderman');
mongoose.connection.on('open', () => {

  if(process.argv[2] == 'report')
    crawler.report(() => {
      mongoose.connection.close();
    });

  else {
    Site.remove({}, () => {
      new Site({url: {full: 'https://github.com/'}}).save((err, doc) => {
        crawler.crawl(result => {
          mongoose.connection.close();
        });
      });
    });

  }
  
});