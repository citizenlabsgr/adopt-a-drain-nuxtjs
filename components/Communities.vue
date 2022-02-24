<template>
  <div>
    <a @click="showModal()">{{title}}</a>
    <ModalCommunities
      v-show="isModalVisible"
      @close="closeModal"
    >
      <template v-slot:header>{{title}}</template>
      <template v-slot:sub-title>{{subtitle}}</template>
      <template v-slot:body>
        <ul>
          <li v-for="item in getCommunityList()"><a @click="onClickGoPoint(item.lon,item.lat)">{{item.name}} ({{item.count}})</a></li>
        </ul>
      </template>
      <template v-slot:footer>
        {{title}}
      </template>
    </ModalCommunities>

  </div>
</template>
<script>
import config from '@/components/config/community.json';
import Expiration from '@/components/mixins/expiration/ExpirationMixin.js';
import GoogleMapMixin from '@/components/mixins/map/GoogleMapMixin.js';
import CommunityMixin from '@/components/mixins/community/CommunityMixin.js';
import GraphMixin from '@/components/mixins/graph/GraphMixin.js';

// Modals
import ModalCommunities from '@/components/Modal.vue';
/* istanbul ignore next */
export default {

  mixins: [Expiration, GraphMixin,GoogleMapMixin,ModalCommunities,CommunityMixin],
  components: {
    ModalCommunities,
  },
  data () {
    return {
      name: "Communities",
      title: config.title,
      subtitle: config.subtitle,
      isModalVisible:false,
    }
  },
  mounted () {

      this.addMount(this.name);

      this.communityGetRequest()
        .then((response) => {
          this.communityGetHandler(response);
          this.addSpace();
          this.addEnd();

          this.showGraph();
        })
        .catch((err) => {
          console.error('communityGetRequest ', err);
          this.addError(err);
        });

  },
  methods: {
    onClickGoPoint(lon, lat) {
      this.addEmit('click-go-point');
      this.$nuxt.$emit('click-go-point',lon, lat);
    },
    showModal() {
      this.isModalVisible=true;
    },
    closeModal() {
      // set all dialog to closed/false
      this.isModalVisible = false;
    },
  }
}
</script>

<style scoped>

</style>
