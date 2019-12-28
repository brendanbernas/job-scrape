const rp = require('request-promise');
const cheerio = require('cheerio');

var urls = [];

var options = {
    uri: '',
    transform: function (body) {
        return cheerio.load(body);
    }
};

function log_error(error){
  console.log("Error: ", error);
}

function __handle_initial_search($){
  __save_result_page_urls($);
  next_page = __get_next_pagination_url($)
  if(next_page){
    options.uri = next_page;
    rp(options)
      .then(__handle_subsequent_search)
      .catch(log_error);
  } else {
    console.log(urls);
  }

}

function __save_result_page_urls($){
  const res = $("#result_block>article");
  for(i = 0; i < res.length; i++){
    const href = res[i].firstChild.attribs.href;
    urls.push('https://www.jobbank.gc.ca' + href);
  }
};

/**
 * Save urls of page, and go to next page if exists
 */
function __handle_subsequent_search($){
  __save_result_page_urls($);
  next_page = __get_next_pagination_url($)
  if(next_page){
    options.uri = next_page;
    rp(options)
      .then(__handle_subsequent_search)
      .catch(log_error);
  }
}

function __get_next_pagination_url($){
  
  // Get the anchor tag directly after the active pagination list item
  const res = $('.pagination>li[class="active"] + li>a');

  if(res.length > 0){
    return "https://www.jobbank.gc.ca/jobsearch/jobsearch" + res[0].attribs.href;
  }

  return null;
}

class JobbankSearchCrawler{
  
  constructor(){
    // urls = [];
  }

  crawl(url){
    var options = {
      uri: url,
      transform: function (body) {
        return cheerio.load(body);
      }
    };

    rp(options)
      .then(__handle_initial_search)
      .catch(log_error);
  }

  urls(){
    return urls;
  }
}

module.exports = JobbankSearchCrawler;