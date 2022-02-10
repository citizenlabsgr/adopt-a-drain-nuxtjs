'use strict';

module.exports = class Graph {
    constructor() {
      /* $lab:coverage:off$ */
      this.graphArray = [];
      this.idx = 0;
      this.folder = __dirname;
      this.name = 'graph.md';
      this.start = '    (*) ';
      this.down =  '     | ' ;
      this.end =   '    [=] ';
    }

    setFile(folder, name) {
      this.folder = folder;
      this.name = name;
    }

    getClassName() {
      return this.constructor.name;
    }

    getName() {
      return this.name;
    }

    setIdx(i) { this.idx = i; return this;}

    getIdx() {return this.idx;}

    appendGraph(graph) {
       this.graphArray.concat(graph);
       return this;
    }
    showGraph() {
      console.log(this.getGraph());
      this.clearGraph();
    }
    addError(err) {
      this.addGlyph(` [${err}] `);
      return this;
    }
    addRequestService(method, name) {
      method = this.pad(method, ' ', 6);
      switch (method) {
        case 'GET   ':
          this.addGlyph(` [ Find ${name} ] .`,this.down) ;
          break;
        case 'POST  ':
          this.addGlyph(` [ Save ${name} ] .`,this.down) ;
          break;
        case 'PUT   ':
          this.addGlyph(` [ Update ${name} ] .`,this.down) ;
          break;
        case 'DELETE':
          this.addGlyph(` [ Delete ${name} ] .`,this.down) ;
          break;
      }
      this.addSpace();
      this.addGlyph(this.down,  `     + ---> (${method}) >`,`> [[ ${name} Service ]] `);
      this.addGlyph(this.down,' ', this.down);
    }

    addResponseService(method, name, outputs) {
      method = this.pad(method, ' ', 6);
      this.addGlyph(this.down,  `     + <<`,`<   ${outputs} `);
      this.addSpace();
    }

    add_PassFail(...theArgs) { // call direct from graph instance
      // position 1 is Prefix for Handler name
      // position 2 is name or number of failure
      // position 3 is ...
      this.addPassFail(theArgs);
    }

    addPassFail(theArgs) { // call from mixin
      this.addSpace();

      let name = theArgs[0];
      this.addGlyph(this.down,` [ ${name} Handler] -`, '-> + ');

      for (let i in theArgs) {
        if (i > 0) {
          this.addGlyph(this.down,this.down,`   + ---> (${theArgs[i]}) ---> [=] `);
        }
      }

      this.addGlyph(this.down,this.down,'   + ---> (fail) ---> [=] ');

      // this.addSpace();
      this.addGlyph(this.down,'  (success) ');
      this.addSpace();
    }

    addGlyphs(theArgs) {
      let glyph = '';

      for(let i in theArgs) {
        let ps = theArgs[i][0];
        let pe = theArgs[i][theArgs[i].length - 1];
        glyph += `${this.pad('',ps,4)}${this.pad(theArgs[i],pe)}`;
      }
      this.graphArray.push(glyph);
      return this;
    }

    addStart() {
      this.addGlyph(this.start,this.start);
    }
    addEnd() {
      this.addGlyph(this.end,this.end);
    }
    addSpace() {
      this.addGlyph(this.down,this.down);
    }

    addGlyph(...theArgs) {

      this.addGlyphs(theArgs);
      return this;
    }

    getGraph() {
        return this.graphArray.join('\n');
    }

    pad(str, padding=' ', w=30) {
      while (str.length < w ) {
         str += padding;
      }
      return str;
    }

    formatName(name) {
      return fN(name);
    }
    fN(name) {
      return `[ ${name} ]`
    }
    formatOutput(output) {
      let rc = '';
      console.log('formatOutput object');

      switch (typeof(output)) {
        case 'string':
          rc = `${output}`;
          break;
        case 'object':
          // console.log('object');
          if (Array.isArray(output)) {
            for (let i in output[0]) {
              if (rc.length > 0) {
                rc += ',';
              }
              rc += i;
            }
            rc = `[(${rc}),...]`;
          }
          break;
        default:
          rc = `${output}`;
      }
      return rc;
      
    }
    formatVariable(variable) {
      return fV(variable);
    }
    fV(value) {
      let rc = '';
      console.log('value ', typeof(value));
      return rc;
    }

    clearGraph() {
      this.graphArray = [];
      return this;
    }

    writeGraph() {

    }
  // $lab:coverage:on$
};
