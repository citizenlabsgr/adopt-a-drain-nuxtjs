<template>

  <div class="band">

    <div>
      <!-- div>{{ getSponsorList() }}</div -->
      <div v-for="item in getSponsorList()" :key="item.name">
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
        <div v-else-if="item.name==='item_title'" class="list_title">
          {{ item.value }}
        </div>
        <div v-else-if="item" :class="getRowClass(item)">
          {{ item.value }}
        </div>
        <div v-else></div>
      </div>
    </div>
    <br/>

  </div>
</template>

<script>
// [.Sponsor]:
// |not(/sponsor)|: [*],[*]
// |/sponsor|: [*], Config
// |AAD_API_TOKEN|: Env, Load
/* istanbul ignore next */

import Expiration from '@/components/mixins/expiration/ExpirationMixin.js';
import SponsorMixin from '@/components/mixins/sponsor/SponsorMixin.js';
import ServiceMixin from "~/components/mixins/service/ServiceMixin";

export default {
    mixins: [Expiration, ServiceMixin, SponsorMixin],
// [Config]:
// |(page)|: Config, Load
  data () {
    return {
      page: {
        "title": "Sponsor",
        "subtitle": "We can't do this alone."
      }
    }
  },
  mounted () {
    // [Load]:
    // |(get service.sponsor.output.sponsorList)|:

    // [*Load]:
    // [[Start]]:
    // ||/sponsor||: [*], SponsorGetRequest
    // ||AAD_API_TOKEN||: Env, SponsorGetRequest

    // [[SponsorGetRequest]]:
    // ||(get service.sponsor.response)||:

    this.sponsorGetRequest()
      .then((response) => {
        // [[SponsorGetHandler]]:
        this.sponsorGetHandler(response);
        // ||(get service.sponsor.output.sponsorList)||:
      })
      .catch((err) => {
        console.error('sponsorGetRequest ', err);
      });
      // [[End]]:
  },
  methods: {
    // [Show]: /sponsor
    // |not(/sponsor)|: Show, [*]

    // [*Show]: /sponsor
    // [[Start]]:

    getTitle() {
      // [[Title]]:
      return this.page.title;
    },
    getSubtitle() {
      // [[Subtitle]]:

      return this.page.subtitle;
    },
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
    // [[Sponsor]]: sponsorList
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
.img_sponsor {
  height: 100px
}

</style>
