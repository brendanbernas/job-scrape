const JobbankQueryBuilder = require("../lib/query/jobbank_query_builder");
const crawl = require("../lib/crawl/jobbank_search_crawler");
const scrape = require("../lib/scrape/jobbank_scraper");
const fs = require('fs');

jbUrl = new JobbankQueryBuilder().location('Alberta').term('designer').build();

function log_err(err){
  console.log("Error: ", err);
}

crawl(jbUrl)
.then(function(urls){
  console.log(`Found ${urls.length} urls.`);

  let found = []
  for(i in urls){
    let url = urls[i];
    console.log(`Scraping ${url}`);
    scrape(url)
    .then(
      function(res){
        found.push(res);
        // console.log(res);
      }
    ).catch(log_err);
  }
  // FIXME ensure all scraping promises are fulfilled to write results
  console.log(found);
  fs.writeFile('results.json', found, 'utf8', function(res){
    console.log(res);
  });

})
.catch(log_err);
