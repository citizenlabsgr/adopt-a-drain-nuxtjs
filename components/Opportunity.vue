<template>

  <div class="band">

    <div>
      <div v-for="item in getOpportunityList()" :key="item.name">
        <h1 v-if="item.name==='id'" class="title">

        </h1>
        <h1 v-else-if="item.name==='title'" class="title">
          {{ item.value }}
        </h1>

        <h2 v-else-if="item.name==='subtitle'" class="subtitle">
          {{ item.value }}
        </h2>

        <h3 v-else-if="item.name==='description'" class="description">
          {{ item.value }}
        </h3>
        <div v-else-if="item && item.name==='item_title'" class="list_title">
          {{ item.value }}
        </div>
        <div v-else-if="item" :class="getRowClass(item)">
          {{ item.value }}
        </div>
      </div>
    </div>
    <br/>
  </div>
</template>
<script>
// [.Opportunity]:
// |not(/opportunity)|: [*], [*]
// |/opportunity|: [*], Config
// |AAD_API_TOKEN|: Env, Load

// [Config]:
// |(page)|:
import Expiration from '@/components/mixins/expiration/ExpirationMixin.js';
import ServiceMixin from '@/components/mixins/service/ServiceMixin.js';
import OpportunityMixin from '@/components/mixins/opportunity/OpportunityMixin.js';

/* istanbul ignore next */
export default {
  mixins: [Expiration, ServiceMixin, OpportunityMixin],

  data () {
    return {
      page: {
        "title": "Opportunity",
        "subtitle": "We care about what you want to do.",
        "description": "Are you a programmer with Nuxtjs experience who wants to help improve and maintain the Adopt a Drain application? Dont be shy! We are always seeking assistance with the code! Get involved and follow our GitHub page.",
        "opportunityTitle": "Always looking for:"
      }
    }
  },

  mounted () {

      // [Load]:
      // |"(page), (opportunityList)"|:

      // [*Load]:
      // [[Start]]:
      // ||/opportunity||: [*], OpportunityGet
      // ||AAD_API_TOKEN||: Env, OpportunityGet

      // [[OpportunityGet]]:
      // ||(get service.opportunity.response)||:
      // console.log('mounted opportunityGetRequest ');

      this.opportunityGetRequest()
        .then((response) => {
          // [[OpportunityGetHandler]]:
          this.opportunityGetHandler(response);
          // ||(get service.opportunity.opportunityList)||:
        })
        .catch((err) => {
          console.error('opportunityGetRequest ', err);
        });

      // [[End]]:
  },
  methods: {
    // [Show]: /opportunity
    // |not(/opportunity)|:

    // [*Show]: /opportunity
    // [[Start]]:
    // [[Title]]:
    // [[Subtitle]]:
    // [[Description]]:
    // [[OpportunityTitle]]:
    // [[Opportunity]]: opportunityList
    // [[End]]:
    getRowClass(item) {
      // assumes item.name is like "item_2"
      // let a = item.name.split('_');
      // let n = Number(a[1]);
      let n = item.row;
      let rc = "empty text";
      if (n % 2 > 0) {
        rc = "solid text";
      }
      return rc;
    }
  }
}

// [End]:
</script>

<style scoped>
.band {
  width: 100%;
}

ul {
  /* list-style: none; */
  padding: 0;
  margin: 0;
  display: flex;
  flex-flow:row wrap;
  justify-content: center;
  align-items: center;
}

li {
  margin: 0px 10px 0px 20px;
}




</style>
