'use strict';

module.exports = class Graph {
    constructor() {
      /* $lab:coverage:off$ */
      this.graphArray = [];
      this.idx = 0;
      this.folder = __dirname;
      this.name = 'graph.md'
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

    addGlyphs(theArgs) {
      // console.log('addGlyphs');
      let glyph = '';
      for(let i in theArgs) {
        let ps = theArgs[i][0];
        let pe = theArgs[i][theArgs[i].length - 1];
        glyph += `${this.pad('',ps,4)}${this.pad(theArgs[i],pe)}`;
      }
      this.graphArray.push(glyph);
      return this;
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
