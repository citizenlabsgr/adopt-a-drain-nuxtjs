import Graph from '@/components/mixins/graph.js';
export default {
  data () {
    return {
      name: 'Graph',
      on: false,
      graph: new Graph()
      // graph: []
    };
  },
  methods: {

    addGlyph(...theArgs) {
      this.graph.addGlyphs(theArgs);
      /*
      let glyph = '';
      for(let i in theArgs) {
        glyph += this.pad(theArgs[i]);
      }
      this.graph.push(glyph);
      */
    },
    appendGraph(graph) {
      // this.graph.concat(graph);
      this.graph.appendGraph(graph);
    },
    getGraph() {
      return this.graph.getGraph();
        //return this.graph.join('\n');

    },

    pad(str, padding=' ', w=24) {
      return this.graph.pad(str, padding, w);
      /*
      while (str.length < w ) {
         str += padding;
      }

      return str;
      */
    },

    clearGraph() {
      this.graph.clearGraph();
    }
  }
}
