<template>
  <div class="document">
    <br/>

  <div class="document"><span v-html="renderedHtml"></span></div>
  </div>
</template>
<script>

import Expiration from '@/components/mixins/ExpirationMixin.js'
import DataWorld from '@/components/mixins/DataWorldMixin.js'
import GoogleMapMixin from '@/components/mixins/GoogleMapMixin.js'

/* istanbul ignore next */
export default {
  mixins: [Expiration, DataWorld, GoogleMapMixin],

  data () {
    return {
      name: 'Terms of Use',
      renderedHtml: '',
      stack: [],
      markdown: [
      '# Terms of Use',
      '### Adopt a Drain Grand River',
      'Website Terms of Use Agreement',
      '### 1. Acceptance of Terms of Use',
      'Grand Valley Metro Council (GVMC) and the sponsoring jurisdictions of ',
      '[[communities]]',
      'provides the Adopt-a-Drain program ("AAD") to you subject to the following Terms of Use Agreement ("Agreement") which may be updated by us from time to time without notice to you. By accessing and using AAD, you accept and agree to be bound by the terms and provision of this Agreement.',

      ]
    }
  },
  watch: {
    communities: function () {
      // Objective: Wait for document to load
      // Strategy: load communities and document using rest in mount() then wait for data to show.
      this.render();
      this.replace();
    }
  },
  mounted () {
    console.log(`
        (*)
         |
      [mounted Terms of Use]
         |`);

      // this.ldC();
      this.communityGetRequest();
      console.log('done loaded');
      // this.render();
      // this.replace();

  },
  methods: {
    replace() {
      this.renderedHtml = this.renderedHtml.replace('[[communities]]', this.renderCommunity());
    },
    renderCommunity() {
      let rc = '<ul>';
      let lst = this.getCommunityList();

      for (let i in lst) {
        rc += `<li>${lst[i].name}</li>`;
      }
      rc += '</ul>';

      return rc;
    },
    render() {
      let ex = '';
      let ln = '';
      for (let i in this.markdown){
        ln = this.markdown[i];
        if (this.stack.length > 0) {
          if (!ln.startsWith('* ')) {
            ex = this.stack.pop();
          }
        }
        if (ln.startsWith('# ')) {
           this.renderedHtml += `<h1>${ln.replace('#','')}</h1>`;
        }
        else if (ln.startsWith('## ')) {
          this.renderedHtml +=  `<h2>${ln.replace('##','')}</h2>`;
        }
        else if (ln.startsWith('### ')) {
          this.renderedHtml +=  `<h3>${ln.replace('###','')}</h3>`;
        }
        else if (ln.startsWith('#### ')) {
          this.renderedHtml +=  `<h4>${ln.replace('####','')}</h4>`;
        }
        else if (ln.startsWith('##### ')) {
          this.renderedHtml +=  `<h5>${ln.replace('#####','')}</h5>`;
        }
        else if (ln.startsWith('###### ')) {
          this.renderedHtml +=  `<h6>${ln.replace('######','')}</h6>`;
        }
        else if (ln.startsWith('* ')) {
          if (this.stack.length === 0) {
            this.stack.push('</ul>')
            this.renderedHtml += '<ul>'
          }
          this.renderedHtml += `<li>${ln.replace('*','')}</li>`;
        }
        else {
          this.renderedHtml += `<p>${ln}</p>`;
        }

      }

    }
  }
}
</script>
<style scoped>
  ul.nobullets {
    list-style-type: none;
  }
  .document {
    font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
      'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    /*min-height: 10vh;*/
    /*min-height: 300px;*/
    max-width: 600px;
    display: flex;
    flex-flow: column nowrap;
    align-items: left;
    text-align: left;
    padding-left: 15px;
    padding-right: 15px;
  }
</style>
