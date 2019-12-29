const JobbankQueryBuilder = require("../lib/query/jobbank_query_builder");
const crawl = require("../lib/crawl/jobbank_search_crawler");

jbUrl = new JobbankQueryBuilder().location('Alberta').term('designer').build();

crawl(jbUrl)
.then(function(urls){
  console.log("Found urls: ", urls);
})
.catch(function (error){
  console.log("Error: ",  error);
});
