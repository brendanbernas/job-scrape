var request = require('request');
var cheerio = require('cheerio');
const fs = require('fs');

var contents = fs.readFileSync('scrape_results/job_bank121619.html', 'utf8');
parse(contents);

function parse(html){
  const $ = cheerio.load(html);
  // console.log(html);
  var res = $("#result_block>article");
  for(i = 0; i < res.length; i++){
    var href = res[i].firstChild.attribs.href;
    console.log(href);
  }
  // Array.forEach(res => {
  //   var href = resultItem.firstChild.href;
  //   console.log(href);
  // });
  // console.log(res[0]);
}
