<template>
  <div class="band">
    <br/>

      <div v-for="item in getStatisticList()">

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
      <br/>
      <table>
        <tr v-for="item in getStatisticRows()" :key="item.row">
          <td v-for="c in item">
            {{ c }}
          </td>
        </tr>
      </table>
    <br/>
      <table>
        <tr v-for="item in getCommunityRows()" :key="item.row">
          <td v-for="c in item">
            {{ c }}
          </td>
        </tr>
      </table>
    <br/>
  </div>


</template>

<script>
// [.Statistic]:
// |not(/statistic)|: [*],[*]
// |/statistic|: [*], Config
// |AAD_API_TOKEN|: Env, Load

// [Config]:
// |(page)|: Config, Load

/* istanbul ignore next */
import Expiration from '@/components/mixins/expiration/ExpirationMixin.js';
import ServiceMixin from '@/components/mixins/service/ServiceMixin.js';
import StatisticMixin from '@/components/mixins/statistic/StatisticMixin.js';
import CommunityMixin from '@/components/mixins/community/CommunityMixin.js';

export default {
  mixins: [Expiration,ServiceMixin, StatisticMixin, CommunityMixin],

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
      // ||/statistic||: [*], StatisticGetRequest
      // [[StatisticGetRequest]]:
      // ||(get service.stats.response)||:
      this.statisticGetRequest()
        .then((response) => {
          // [[StatsGetHandler]]:
          // console.log('response',response);
          this.statisticGetHandler(response);
          // console.log('getStatisticList',this.getStatisticList());
          // ||(get service.statistic.output.statsList)||:
        })
        .catch((err) => {
          console.error('statisticGetRequest ', err);
        });

      // [[CommunityGetRequest]]:
      this.communityGetRequest()
       .then((response) => {
         // [[CommunityGetHandler]]:
         // console.log('response',response);
         this.communityGetHandler(response);
         // console.log('getStatisticList',this.getStatisticList());
         // ||(get service.statistic.output.statsList)||:
       })
       .catch((err) => {
         console.error('statisticGetRequest ', err);
       });

        // [[End]]:
    },
    methods: {
    // [Show]: /statistic
    // |not(/statistic)|:

    // [*Show]: /statistic
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
table {
  border-collapse: collapse;
  border-spacing: 0;
  width: 50%;
  border: 1px solid #ddd;
  margin-left: auto;
  margin-right: auto;
}

th, td {
  text-align: left;
  padding: 8px;
}

tr:nth-child(even){background-color: #f2f2f2}
/*
.center {
  margin-left: auto;
  margin-right: auto;
}

 */

</style>
