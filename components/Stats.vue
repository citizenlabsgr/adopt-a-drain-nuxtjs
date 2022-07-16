<template>
  <div class="band">
    <h1 class="title">
      {{ getTitle() }}
    </h1>
    <h2 class="subtitle">
      {{ getSubtitle() }}
    </h2>
    <ul>
      <li v-for="item in getStatsList()" :key="item.id">
        {{ item.description }}
      </li>
    </ul>
  </div>


</template>

<script>
// [.Stats]:
// |not(/stats)|: [*],[*]
// |/stats|: [*], Config 
// |AAD_API_TOKEN|: Env, Load

// [Config]:
// |(page)|: Config, Load

/* istanbul ignore next */ 
import Expiration from '@/components/mixins/expiration/ExpirationMixin.js';
import StatsMixin from '@/components/mixins/stats/StatsMixin.js';

export default {
  mixins: [Expiration,StatsMixin],

  data () {
    return {
      page: {
        title: 'Stats',
        subtitle: 'How much do we care?'
      }
    }
  },
   mounted () {
      // [Load]: 
      // |"((page), (statsList))"|:

      // [*Load]:
      // [[Start]]:
      // ||/stats||: [*], StatsGetRequest
      // [[StatsGetRequest]]:
      // ||(get service.stats.response)||:
      this.statsGetRequest()
        .then((response) => {
          // [[StatsGetHandler]]:
          this.statsGetHandler(response);
          // ||(get service.stats.output.statsList)||:
        })
        .catch((err) => {
          console.error('statsGetRequest ', err);
        });
        // [[End]]:
    },  
    methods: {
    // [Show]: /stats
    // |not(/stats)|:

    // [*Show]: /stats
    // [[Start]]:
    
    getTitle() {
      // [[Title]]: 
      return this.page.title;
    },
    getSubtitle() {
      // [[Subtitle]]:
      return this.page.subtitle;
    }
    // [[Statistics]]: statsList
    // [[End]]:
  }
}
// [End]:
</script>

<style scoped>
.band {
  width: 100%;
  background-color: #ffffff;
}
ul {
  list-style: none;
  padding: 0;
  margin: 0px;
  display: flex;
  flex-flow:row wrap;
  justify-content: center;
  align-items: center;
}

li {
  margin: 20px 20px;
}
</style>
