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
      {{ page.aboutTitle }}
    </div>
    <ul>
      <li v-for="item in getAboutList()" :key="item.id">
        {{ item.description }}
      </li>
    </ul>
  </div>

</template>

<script>
// [.About]:
// |not(/about)|: [*],[*]
// |/about|: [*], Config
// |AAD_API_TOKEN|: Env, Load

// [Config]:
// |(page)|:

import Expiration from '@/components/mixins/expiration/ExpirationMixin.js';
import ServiceMixin from '@/components/mixins/service/ServiceMixin.js';
import AboutMixin from '@/components/mixins/about/AboutMixin.js';

export default {
  mixins: [Expiration, ServiceMixin, AboutMixin],

  data () {
    return {
      name: "About",
      page: {
        title:"About",
        subtitle:"We are concerned citizens.",
        description:"",
        aboutTitle:"LGROW"
      }
    }
  },

  mounted () {
    // [Load]:
    // |"((page), (aboutList))"|:

    // [*Load]:
      // [[Start]]:
      // ||/about||: [*], AboutGet
      // ||AAD_API_TOKEN||: Env, AboutGet

      // [[AboutGet]]:
      // ||(get service.about.response)||:
      this.aboutGetRequest()
        .then((response) => {
          // [[AboutGetHandler]]:
          this.aboutGetHandler(response);
          // ||(get service.about.output.aboutList)||:
        })
        .catch((err) => {
          console.error('aboutGetRequest ', err);
        });
        // [[End]]:

  },

  methods: {
    // [Show]: /about
    // |not(/about)|:

    // [*Show]: /about
    // [[Start]]:
    // [[Title]]:
    // [[Subtitle]]:
    // [[Description]]:
    // [[AboutTitle]]:
    // [[About]]: aboutList
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
  list-style:inside;
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
