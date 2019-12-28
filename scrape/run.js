var request = require('request');
var cheerio = require('cheerio');
const fs = require('fs');

var urls = [];

// request('https://www.jobbank.gc.ca/jobsearch/jobsearch?searchstring=designer+Toronto', handle_result_pages_for_posting_urls);
request('https://www.jobbank.gc.ca/jobsearch/jobsearch?searchstring=designer+alberta&action=s2', handle_result_pages_for_posting_urls);

function handle_result_pages_for_posting_urls(err, resp, html){
  if(err){
    console.log(err);
    return;
  }

  const $ = cheerio.load(html);

  // scrape urls off single page
  save_result_page_urls($);

  // scrape next page if exists
  const nextPage = get_next_pagination_url($);
  if(nextPage){
    request(nextPage, handle_result_pages_for_posting_urls);  
  }else{
    // At last page, done scraping URLs
    console.log(urls);
    console.log("URLs found: " + urls.length);
  }
};

function save_result_page_urls($){
  const res = $("#result_block>article");
  for(i = 0; i < res.length; i++){
    const href = res[i].firstChild.attribs.href;
    urls.push('https://www.jobbank.gc.ca' + href);
  }
};

function get_next_pagination_url($){

  // Get the anchor tag directly after the active pagination list item
  const res = $('.pagination>li[class="active"] + li>a');

  if(res.length > 0){
    return "https://www.jobbank.gc.ca/jobsearch/jobsearch" + res[0].attribs.href;
  }

  return null;
}
