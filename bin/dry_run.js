const JobbankQueryBuilder = require("../lib/query/jobbank_query_builder");
const JobbankSearchCrawler = require("../lib/crawl/jobbank_search_crawler");

jbUrl = new JobbankQueryBuilder().location('Alberta').term('designer').build();

console.log(jbUrl);

crawler = new JobbankSearchCrawler();
res = crawler.crawl(jbUrl);
console.log(res);
