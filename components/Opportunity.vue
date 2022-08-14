<template>

  <div class="band">
    <br/>
    <div>
      <div v-for="item in getOpportunityList()" :key="item.name">

        <h1 v-if="item.name==='title'" class="title">
          {{ item.value }}
        </h1>

        <h2 v-if="item.name==='subtitle'" class="subtitle">
          {{ item.value }}
        </h2>

        <h3 v-if="item.name==='description'" class="description">
          {{ item.value }}
        </h3>

      </div>
    </div>
    <br/>
    <div>
      <ul v-for="item in getOpportunityList()" :key="item.name">

        <li v-if="item.name && item.name.startsWith('item')" >
          {{ item.value }}
        </li>

      </ul>
    </div>
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
          console.log('opportunityGetRequest response ', response);
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
