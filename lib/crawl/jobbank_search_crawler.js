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
    this.somevalue = "is here";
  }

  // executor(resolve, reject){
  //   this.resolve = resolve;
  //   this.reject = reject;
  // }

  crawl(url){
    return new Promise(function(resolve, reject){

      this.options = {
        uri: url,
        transform: function (body) {
          return cheerio.load(body);
        }
      };

      rp(options)
        .then(__handle_initial_search)
        .catch(log_error);
    });
  }

  urls(){
    return urls;
  }
}

module.exports = {JobbankSearchCrawler, crawl};

// myCrawler = new JobbankSearchCrawler().crawl("http://www.example.com");

let mypromise = crawl("https://www.jobbank.gc.ca/jobsearch/jobsearch?searchstring=designer+Alberta&action=s2")
mypromise.then(
  function (urls){
    console.log("urls: ", urls);
  }
).catch(function(errro){
  console.log("errors: ", error);
});

function crawl(url){
  return new Promise(function (resolve, reject) {
    let options = {
      uri: url,
      transform: function (body) {
        return cheerio.load(body);
      }
    };

    function log_error(error){
      console.log("Error: ", error);
      reject(error);
    }

    rp(options)
      .then(function __handle_initial_search($){
        __save_result_page_urls($);
        next_page = __get_next_pagination_url($)
        if(next_page){
          options.uri = next_page;
          rp(options)
            .then(function __handle_subsequent_search($){
              __save_result_page_urls($);
              next_page = __get_next_pagination_url($)
              if(next_page){
                options.uri = next_page;
                rp(options)
                  .then(__handle_subsequent_search)
                  .catch(log_error);
              }else{
                // no more pages
                resolve(urls);
                console.log(urls);
              }
            })
            .catch(log_error);
        } else {
          resolve(urls);
          console.log(urls);
        }
      })
      .catch(log_error);
    
  });
};