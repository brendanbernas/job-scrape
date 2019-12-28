class JobbankQueryBuilder {

  constructor() {
    this._location = "";
    this._term = "";
    return this;
  }

  location(v) {
    this._location = v;
    return this;
  }

  term(v){
    this._term = v;
    return this;
  }

  build(){
    return `https://www.jobbank.gc.ca/jobsearch/jobsearch?searchstring=${this._term}+${this._location}&action=s2`
  }

}

module.exports = JobbankQueryBuilder;