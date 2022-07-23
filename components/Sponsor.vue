<template>
  <div class="band">
    <h1 class="title">
      {{ getTitle() }}
    </h1>
    <h2 class="subtitle">
      {{ getSubtitle() }}
    </h2>
    <!-- ul>
      <li><a href="https://www.lgrow.org" target="_blank"><img src="~assets/logos/LGrow.png" class="img_sponsor"></img></a></li>
      <li><a href="https://citizenlabs.org" target="_blank"><img src="~assets/logos/citizenlabs.png" class="img_sponsor"></img></a></li>
    </ -->
    <ul>
      <li v-for="item in getSponsorList()" :key="item.id">
        {{ item.description }}
      </li>
    </ul>
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
        "title": "Sponsors",
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

    // [[Sponsors]]: sponsorList
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
