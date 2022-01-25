<template>
  <div class="document">
    <br/>

  <div class="document"><span v-html="renderedHtml"></span></div>
  </div>
</template>
<script>

import Expiration from '@/components/mixins/ExpirationMixin.js'
// import DataWorld from '@/components/mixins/DataWorldMixin.js'
import GoogleMapMixin from '@/components/mixins/GoogleMapMixin.js'
import TouMixin from '@/components/mixins/TouMixin.js'
import CommunityMixin from '@/components/mixins/CommunityMixin.js';
/* istanbul ignore next */
export default {
  mixins: [Expiration, CommunityMixin, GoogleMapMixin, TouMixin],

  data () {
    return {
      name: 'Terms of Use',
      renderedHtml: ''
    }
  },
  watch: {
    communities: function () {
      // Objective: Wait for document to load
      // Strategy: load communities and document using rest in mount() then wait for data to show.
      // this.render();
      // this.replace();
    }
  },
  mounted () {
    console.log(`
        (*)
         |
      [mounted Terms of Use]
         |`);

      this.requestTou()
        .then((response) => {
          this.processTou(response);
          this.requestCommunityList()
            .then((response) => {
               this.processCommunityList(response);
               this.renderedHtml = this.renderTou();
               this.replace();
            })
            .catch((err) => {
              console.error('Tou B mount ', err);
            });
        })
        .catch((err) => {
          console.error('Tou A mount ', err);
        });

  },
  methods: {
    replace() {
      this.renderedHtml = this.renderedHtml.replace('[[communities]]', this.renderCommunity());
    },
    renderTou(){
      return this.getTou();
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
