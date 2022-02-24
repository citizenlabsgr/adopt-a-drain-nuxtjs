<template>
  <div class="document">
    <br/>

  <div class="document"><span v-html="config.body"></span></div>
    <!-- Feedback -->
    <h3>
      {{ this.feedback }}
    </h3>
  </div>
</template>
<script>

import Expiration from '@/components/mixins/expiration/ExpirationMixin.js'
import DataWorld from '@/components/mixins/DataWorldMixin.js'
import GoogleMapMixin from '@/components/mixins/map/GoogleMapMixin.js'
import CommunityMixin from '@/components/mixins/community/CommunityMixin.js';
import TOUMixin from '@/components/mixins/tou/TOUMixin.js';

import GraphMixin from '@/components/mixins/graph/GraphMixin.js';
import { RequestTOU } from '@/components/mixins/tou/RequestTOU.js';
import { ResponseTOU } from '@/components/mixins/tou/ResponseTOU.js';
import config from '@/components/config/tou.json';

/* istanbul ignore next */
export default {
  mixins: [Expiration, GraphMixin, DataWorld, GoogleMapMixin, CommunityMixin, TOUMixin],

  data () {
    return {
      name: 'Terms of Use',
      config: {
        title: config.title,
        subtitle: config.subtitle,
        body: ''
      },
      renderedHtml: '',
      stack: [],
      feedback:''
      /*
      markdown: [
      '# Terms of Use',
      '### Adopt a Drain Grand River',
      'Website Terms of Use Agreement',
      '### 1. Acceptance of Terms of Use',
      'Grand Valley Metro Council (GVMC) and the sponsoring jurisdictions of ',
      '[[communities]]',
      'provides the Adopt-a-Drain program ("AAD") to you subject to the following Terms of Use Agreement ("Agreement") which may be updated by us from time to time without notice to you. By accessing and using AAD, you accept and agree to be bound by the terms and provision of this Agreement.',

      ]
      */
    }
  },
  /*
  watch: {
    communities: function () {
      // Objective: Wait for document to load
      // Strategy: load communities and document using rest in mount() then wait for data to show.
      this.render();
      this.replace();
    }
  },
  */
  mounted () {
      this.addMount(this.name);
      this.communityGetRequest ()
          .then((response) => {
              this.communityGetHandler (response);

              ////////////
              const owner = '0';
              const id = 'tou.md';

              new RequestTOU(this).Get(owner,id)
                .then((response) => {

                  const responseRest = new ResponseTOU(this);

                  let s = responseRest.handler(response);

                  switch (s) {
                    case '200':
                      this.formatParagraphs(response);
                      this.render();
                      this.replace();
                      // this.setFeedback('Ok');
                      break;
                    case '400':
                      this.setFeedback('Bad Request');
                      break;
                    case '404':
                      this.setFeedback('Not Found');
                      break;
                    default:
                      // console.log('Unhandled response status ');
                      this.addError(`Unhandled response status ${s}`);
                  }

                  this.addSpace();
                  this.addEnd();
                  this.showGraph();
                  
                })
                .catch((err) => {

                  console.error('Something unexpected happened (%s)!'.replace('%s', err))
                });

              ////////////
              
          })
          .catch((err) => {
              console.error('Something unexpected happened (%s)!'.replace('%s', err));
          });
      
      
  },
  methods: {
    setFeedback(msg) {
      this.feedback = msg;
    },
    replace() {
      this.config.body = this.config.body.replace('[[communities]]', this.renderCommunity());
    },
    renderCommunity() {
      let rc = '<ul>';
      let lst = this.getCommunityList();

      for (let i in lst) {
        rc += `<li class="list-item-bullet"><i>${lst[i].name}</i></li>`;
      }
      rc += '</ul>';
      rc += '<br/>';

      return rc;
    },
    
    render() {
      let ex = '';
      let ln = '';
      let renderedHtml = '';
      for (let i in this.getMarkdown()){
        
        ln = this.getMarkdown(i);

        if (this.stack.length > 0) {
          if (!ln.startsWith('* ')) {
            ex = this.stack.pop();
          }
        }

        if (ln.startsWith('# ')) {
           renderedHtml += `<h1 class="title">${ln.replace('#','')}</h1>`;
        }
        else if (ln.startsWith('## ')) {
          renderedHtml +=  `<h2 class="subtitle">${ln.replace('##','')}</h2>`;
        }
        else if (ln.startsWith('### ')) {
          renderedHtml +=  `<h3>${ln.replace('###','')}</h3>`;
        }
        else if (ln.startsWith('#### ')) {
          renderedHtml +=  `<h4>${ln.replace('####','')}</h4>`;
        }
        else if (ln.startsWith('##### ')) {
          renderedHtml +=  `<h5>${ln.replace('#####','')}</h5>`;
        }
        else if (ln.startsWith('###### ')) {
          renderedHtml +=  `<h6>${ln.replace('######','')}</h6>`;
        }
        else if (ln.startsWith('* ')) {
          if (this.stack.length === 0) {
            this.stack.push('</ul>')
            this.renderedHtml += '<ul>'
          }
          renderedHtml += `<li class="list-item-bullet"><i>${ln.replace('*','')}</i></li>`;
        }
        else {
          renderedHtml += `<p class="description">${ln}</p>`;
        }

      } // for
      this.config.body = renderedHtml;
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
