const
  Site = require('./site')
  request = require('request')
  async = require('async');

exports.crawl = (start, cb) => {
  console.log(`crawl starting at ${start}`);

  let sites = 0;

  // Start fresh each time
  Site.remove({}, () => {
    let parent = new Site({
      url: start
    }).save((err, doc) => {
      get(start, body => {
        let sites = read(body, doc._id);
        async.each(sites, saveSite, err => {
          console.log(`crawl complete. ${sites.length} sites crawled.`);
          cb();          
        });
      });
    });
  });

};

// Get all <a href=""> out of html
const read = (html, parentId) => {
  let links = html.match(/href(\s)*=(\s)*"http[^"']*"/g).map(x => x.split('"')[1]);
  let objs = [];
  links.forEach(link => {
    objs.push(new Site({
      url: link,
      parents: [parentId]
    }));
  });
  return objs;
};

// download html for a url
const get = (url, cb) => {
  request.get(url, (err, res, body) => {
    cb(body);
  });
};

const saveSite = (url, done) => {
  new Site({
    url: url,
  }).save(() => done());
};