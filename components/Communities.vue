<template>
  <div>
    <a @click="showModal()">{{page.title}}</a>
    <ModalCommunities
      v-show="isModalVisible"
      @close="closeModal"
    >
      <template v-slot:header>{{page.title}}</template>
      <template v-slot:sub-title>{{page.subtitle}}</template>
      <template v-slot:body>
        <ul>
          <li v-for="item in getCommunityList()"  :key="item.name"><a @click="onClickGoPoint(item.lon,item.lat)">{{item.name}} ({{item.count}})</a></li>
        </ul>
      </template>
      <template v-slot:footer>
        {{page.title}}
      </template>
    </ModalCommunities>
  </div>
</template>
<script>

// [.Communities]:
// |not(isModalVisible)|: [*], [*]
// |isModalVisible|: [*], Config
// |AAD_API_TOKEN|: Env, Load

// [Config]:
// |(page)|: Config, Load

// import config from '@/components/config/community.json';
import Expiration from '@/components/mixins/expiration/ExpirationMixin.js';
import ServiceMixin from '@/components/mixins/service/ServiceMixin.js'
import GoogleMapMixin from '@/components/mixins/map/GoogleMapMixin.js';
import CommunityMixin from '@/components/mixins/community/CommunityMixin.js';
// import GraphMixin from '@/components/mixins/graph/GraphMixin.js';
// import MermaidMixin from '@/components/mixins/mermaid/MermaidMixin.js';
// Modals
import ModalCommunities from '@/components/Modal.vue';
/* istanbul ignore next */
export default {

  mixins: [Expiration, ServiceMixin, GoogleMapMixin,ModalCommunities,CommunityMixin],
  components: {
    ModalCommunities,
  },

  data () {
    return {
      name: "Communities",
      page: {
        title: "Communities",
        subtitle: "Together"
      },
      isModalVisible:false
    }
  },

  mounted () {
      // [Load]:
      // |"((page), (communityList))"|:

      // [*Load]:
      // [[Start]]:
      // ||isModalVisible||: [*], CommunityGet
      // ||AAD_API_TOKEN||: Env, CommunityGet
      // [[CommunityGet]]:
      // ||(get service.community.response)||:

      this.communityGetRequest()
        .then((response) => {
          // [[CommunityGetHandler]]:
          this.communityGetHandler(response);
          // ||(get service.community.output.communityList)||:

          // [[End]]:
        })
        .catch((err) => {
          console.error('communityGetRequest ', err);
        });
  },

  methods: {
    // [Show]:
    // |not(isModalVisible)|:

    // [*Show]: isModalVisible
    // [[Start]]:
    // [[Title]]:
    // [[Subtitle]]:

    // [[CommunityLinks]]: communityList, moveMap
    // [[End]]:
    onClickGoPoint(lon, lat) {
      // console.log('onClickGoPoint 1');
      // this.addEmit('click-go-point');
      this.$nuxt.$emit('click-go-point',lon, lat);
    },
    showModal() {
      this.isModalVisible=true;
    },
    closeModal() {
      // set all dialog to closed/false
      this.isModalVisible = false;
    }
  }
}
// [End]:

</script>

<style scoped>

</style>
