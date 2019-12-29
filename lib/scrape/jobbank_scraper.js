const rp = require('request-promise');
const cheerio = require('cheerio');

module.exports = scrape;

function cheerio_load_$(body){
  return cheerio.load(body);
}

function query_text($, query){
  res = $(query);

  if(!res){
    return null;
  }
  return get_node_text(res[0]).trim();
}

function get_node_text(node){
  if(node == undefined){
    console.log('wtf');
    return '[null]';
  }

  if(node && node.type == "text"){
    return node.data;
  } else {
    let text = "";
    for(let i = 0; i < node.children.length; i++){
      text += get_node_text(node.children[i]);
    }
    return text;
  }
}

function scrape(url){

  return new Promise(function(resolve, reject){

    function reject_error(error){
      reject(error);
    }

    function scrape_page($) {
      resolve({
        title: query_text($, 'span[property="title"]'),
        pay: query_text($, 'span[property="baseSalary"]'),
        location: query_text($, 'span[typeof="PostalAddress"]'),
        url: url
      });
    }

    rp({uri: url, transform: cheerio_load_$})
    .then(scrape_page)
    .catch(reject_error);
  });


}

/*
scrape("https://www.jobbank.gc.ca/jobsearch/jobposting/31713680;jsessionid=24BE0B4AD22EF7E421181B59DEF56A0A.jobsearch77?source=searchresults")
.then(function(res) {
    console.log(res);
  })
  .catch(function(error){
    console.log(error);
  })
*/