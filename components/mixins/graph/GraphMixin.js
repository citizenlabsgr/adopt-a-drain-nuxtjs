import Graph from '@/components/mixins/graph/graph.js';
export default {
  data () {
    return {
      name: 'Graph',
      on: false,
      graph: new Graph()
      // graph: []
    };
  },
  computed: {
    start() {return this.graph.start;},
    end() {return this.graph.end;},
    down() {return this.graph.down;}
  },
  methods: {

    showGraph() {
      return this.graph.showGraph();
    },

    addStart(name) {
      this.graph.addStart(name);
    },
    addEmit(function_name) {
      this.graph.addEmit(function_name);
    },
    addEnd() {
      this.graph.addEnd();
    },

    addSpace() {
      this.graph.addSpace();
    },

    addMount(name) {
      this.graph.addMount(name);
    },
    
    addError(err) {
      this.graph.addError(err);
    },

    addPassFail(...theArgs) {
      // position 1 is Prefix for Handler name
      // position 2 is name or number of failure
      // position 3 is ...
      this.graph.addPassFail(theArgs);
    },

    addRequestService(method,serviceName) {
      this.graph.addRequestService(method, serviceName)
    },

    addResponseService(method,serviceName, outputs) {
      this.graph.addResponseService(method, serviceName, outputs)
    },

    addGlyph(...theArgs) {
      this.graph.addGlyphs(theArgs);
    },

    appendGraph(graph) {
      // this.graph.concat(graph);
      this.graph.appendGraph(graph);
    },
    formatOutput(output,dflt) {
      return this.graph.formatOutput(output,dflt);
    },

    getGraph() {
      return this.graph.getGraph();
        //return this.graph.join('\n');
    },

    pad(str, padding=' ', w=24) {
      return this.graph.pad(str, padding, w);
    },

    clearGraph() {
      this.graph.clearGraph();
    }
  }
}
