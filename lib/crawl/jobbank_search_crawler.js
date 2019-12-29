const rp = require('request-promise');
const cheerio = require('cheerio');

module.exports = crawl;

function cheerio_load_$(body){
  return cheerio.load(body);
}

function get_next_pagination_url($){
  // Get the anchor tag directly after the active pagination list item
  const res = $('.pagination>li[class="active"] + li>a');

  if(res && res.length > 0){
    return "https://www.jobbank.gc.ca/jobsearch/jobsearch" + res[0].attribs.href;
  }

  return null;
}

function crawl(url){
  let urls = [];

  function save_results_page_urls($){
    const res = $("#result_block>article");
    for(i = 0; res && i < res.length; i++){
      const href = res[i].firstChild.attribs.href;
      urls.push('https://www.jobbank.gc.ca' + href);
    }
  };
  
  return new Promise(function (resolve, reject) {

    function reject_error(error){
      reject(error);
    }

    function recursive_handle_paginated_results($){
      save_results_page_urls($);
      next_page = get_next_pagination_url($)
      if(next_page){
        rp({uri: next_page, transform: cheerio_load_$})
          .then(recursive_handle_paginated_results)
          .catch(reject_error);
      } else {
        resolve(urls);
      }
    }

    rp({uri: url, transform: cheerio_load_$})
      .then(recursive_handle_paginated_results)
      .catch(reject_error);
  });
};