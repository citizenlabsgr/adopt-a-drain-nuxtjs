<template>
  <div class="band">
    <h1 class="title">
      {{ page.title }}
    </h1>
    <h2 class="subtitle">
      {{ page.subtitle }}
    </h2>
    <!-- custom stuff -->
    <div class="description">
      {{ page.description }}
    </div>
    <div class="subtitle">
      {{ page.oppTitle }}
    </div>
    <ul>
      <li v-for="item in getOpportunityList()" :key="item.id">
        {{ item.description }}
      </li>
    </ul>
  </div>
</template>
<script>
// [.Opportunities]:
// |not(/opportunities)|: [*], [*]
// |/opportunities|: [*], Config
// |AAD_API_TOKEN|: Env, Load

// [Config]: 
// |(page)|:
import Expiration from '@/components/mixins/expiration/ExpirationMixin.js';
import OpportunityMixin from '@/components/mixins/opportunity/OpportunityMixin.js';

/* istanbul ignore next */ 
export default {
  mixins: [Expiration,OpportunityMixin],

  data () {
    return {
      page: {
        "title": "Opportunities",
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
      // ||/opportunities||: [*], OpportunityGet
      // ||AAD_API_TOKEN||: Env, OpportunityGet

      // [[OpportunityGet]]:
      // ||(get service.opportunity.response)||:

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
    // [Show]: /opportunities
    // |not(/opportunities)|:

    // [*Show]: /opportunities
    // [[Start]]:
    // [[Title]]: 
    // [[Subtitle]]: 
    // [[Description]]:
    // [[OpportunityTitle]]:
    // [[Opportunities]]: opportunityList
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
