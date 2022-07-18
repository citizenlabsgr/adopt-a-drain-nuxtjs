<template>  
  <div class="document">
    <!--span v-html="config.body"></span-->

    <h3>
      {{ getFeedback() }}
    </h3>
    
    <div v-for="item in getTouList()" :key="item.id">
        <h1 v-if="item.paragraph.startsWith('# ')" class="title">
          {{ item.paragraph.replace('# ','') }}
        </h1>
        <h1 v-else-if="item.paragraph.startsWith('## ')" class="subtitle">
          {{ item.paragraph.replace('## ','') }}
        </h1>   
        <h1 v-else-if="item.paragraph.startsWith('### ')">
          {{ item.paragraph.replace('### ','') }}
        </h1>   
        <h1 v-else-if="item.paragraph.startsWith('#### ')">
          {{ item.paragraph.replace('#### ','') }}
        </h1>           
        <h1 v-else-if="item.paragraph.startsWith('##### ')">
          {{ item.paragraph.replace('##### ','') }}
        </h1> 
        <h1 v-else-if="item.paragraph.startsWith('###### ')">
          {{ item.paragraph.replace('###### ','') }}
        </h1>      
        <li v-else-if="item.paragraph.startsWith('* ')">
          {{ item.paragraph.replace('* ','') }}
        </li>    
        <div v-else-if="item.paragraph.includes('[[communities]]')">
            <li v-for="comm in getCommunityList()" :key="item.name"> 
            {{ comm.name }} 
            </li>
            <br/>
        </div>   
        <h1 v-else class="description">
          {{ item.paragraph }}
        </h1>
    </div> 
  </div>   
</template>
<script>
// [.Tou]:
// |not(/tou)|: [*],[*]
// |/tou|: [*], Config 
// |AAD_API_TOKEN|: Env, Load

// [Config]:

import Expiration from '@/components/mixins/expiration/ExpirationMixin.js';
// import GoogleMapMixin from '@/components/mixins/map/GoogleMapMixin.js';
import CommunityMixin from '@/components/mixins/community/CommunityMixin.js';
import TOUMixin from '@/components/mixins/tou/TOUMixin.js';
/* istanbul ignore next */
export default {
  mixins: [Expiration, CommunityMixin, TOUMixin],

  data () {
    return {
      name: 'Terms of Use',
      page: {
        title: "Terms of Use Not used",
        subtitle: "Adopt a Drain Grand River Not Used",
        feedback: ''
      }
    }
  },
  mounted () {
    // [Load]:
    // |"((communityList), (touList))"|: Load, Show  

    // [*Load]:
    // [[Start]]:
    // ||/tou||: [*], CommunityGetRequest

    // ||AAD_API_TOKEN||: Env, CommunityGetRequest
    // ||AAD_API_TOKEN||: Env, TouGetRequest

    // [[CommunityGetRequest]]:
    // ||(get service.community.response)||:
        // console.log('TOU mounted 1');
        this.communityGetRequest ()
          .then((response) => {
              // console.log('TOU comm response ', response);
              // [[CommunityGetHandler]]:
              // ||(get service.community.output.communityList)||:
              this.communityGetHandler (response);

              const owner = '0';
              const id = 'tou.md';
            
              // [[TouGetRequest]]: 
              // ||(get service.tou.response)||:

              this.touGetRequest(owner,id)
                .then((response) => {
                  // [[TouGetHandler]]:
                  // ||(get service.tou.output.touList)||:
                  // console.log('TOU response ', response);
                  this.touGetHandler(response);
                })
                .catch((err) => {

                  console.error('A Something unexpected happened (%s)!'.replace('%s', err))
                });
              
          })
          .catch((err) => {
              console.error('B Something unexpected happened (%s)!'.replace('%s', err));
          });
    // [[End]]:  
      
  },
  methods: {
    // [Show]: /tou
    // |not(/tou)|: Show, [*]

    // [*Show]: /tou

    // [[Start]]:
    // [[TouDocument]]: touList, communityList

    getFeedback() {
      return this.page.feedback;
    },
    setFeedback(msg) {
      this.page.feedback = msg;
    }
    // [[End]]:
  }
}
// [End]:
</script>
<style scoped>
  /*ul.nobullets {
    list-style-type: none;
  }*/
  .subtitle {
  font-weight: 300;
  font-size: 21px;
  color: #526488;
  word-spacing: 5px;
  padding-left: 0px;
  padding-right: 15px;
  padding-bottom: 15px;
}
/*
  ul {
    list-style: none;
    padding: 10px;
  }
 */
 li {
    padding-left: 20px;
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
