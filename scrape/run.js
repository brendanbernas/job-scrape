var request = require('request');
var cheerio = require('cheerio');
const fs = require('fs');

request('https://www.jobbank.gc.ca/jobsearch/jobsearch?searchstring=designer+Toronto', function(err, resp, html) {
  if (!err){
    // const $ = cheerio.load(html);
    
    fs.writeFile("res.html", html, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
    }); 
    // console.log(html);
  }
});

