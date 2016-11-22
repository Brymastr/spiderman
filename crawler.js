const
  Site = require('./site')
  request = require('request')
  async = require('async');

var urlList = []; // in-memory method for performance. Requires significantly more ram.

exports.crawl = done => {
  Site.findOne({traversed: false}, (err, site) => {

    if(!site || err)
      done('Error? Or maybe it\'s just done!');

    get(site.url.full, body => {
      let sites = read(body, site._id);
      async.each(sites, saveSite, err => {
        // console.log(`crawl complete. ${sites.length} sites crawled.`);
        site.traversed = true;
        site.save(() => this.crawl(() => done('Done')));
      });
    });

  });
};

// Get all <a href=""> out of html
const read = (html, parentId) => {
  let objs = [];
  try {
    let links = html.match(/href\s*=\s*"http[^"']*"/ig).map(x => x.split('"')[1]);
    links.forEach(link => {
      objs.push(new Site({
        'url.full': link,
        parents: [parentId]
      }));
    });
  } catch(err) {
    // No links on that page
  } finally {
    return objs;
  }
};

// download html for a url
const get = (url, cb) => {
  request.get(url, (err, res, body) => {
    cb(body);
  });
};

const saveSite = (site, done) => {
  Site.findOne({'url.full': site.url.full}, (err, result) => {
    if(!result) site.save(() => done());
    else done();
  });

  // This would be faster
  // if(urlList.indexOf(site.url) != -1)
  //   site.save(() => done());
  // else
  //   done();
};

exports.report = done => {
  Site.find({}, (err, sites) => {
    let distinctDomains = [];
    sites.forEach(site => {
      if(distinctDomains.indexOf(site.url.domain) == -1)
        distinctDomains.push(site.url.domain);
    });

    console.log(`Sites crawled: ${sites.length}`);
    console.log(`Unique domains: ${distinctDomains.length}`)

    done();
  })
};