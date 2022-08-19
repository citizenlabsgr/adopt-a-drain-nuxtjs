<template>
  <div class="band">
    <br/>
    <div>
      <div v-for="item in getAboutList()" :key="item.name">

          <div v-if="item.name==='title'" class="title">
            {{ item.value }}
          </div>

          <div v-if="item.name==='subtitle'" class="subtitle">
            {{ item.value }}
          </div>

          <div v-if="item.name==='description'" class="description">
            {{ item.value }}
          </div>

          <div v-if="item && item.name.endsWith('0')" class="empty text">
            {{ item.value }}
          </div>
          <div v-else-if="item && item.name.endsWith('1')" class="solid text ">
            {{ item.value }}
          </div>
          <div v-else-if="item && item.name==='item_title'" class="list_title">
            {{ item.value }}
          </div>

      </div>
    </div>
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
          // console.log('aboutGetRequest ', response);
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
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-flow:row wrap;
  justify-content: center;
  align-items: center;
}
li {
  padding-left: 20px;
  font-variant: petite-caps;
}


</style>
