<template>

  <div class="band">
    <br/>
    <div>
      <div v-for="item in getSponsorList()" :key="item.name">

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
      <ul v-for="item in getSponsorList()" :key="item.name">

        <li v-if="item.name && item.name.startsWith('item')" >
          {{ item.value }}
        </li>

      </ul>
    </div>
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
