<template>
  <div>
    <!--button type="button" class="btn" @click="showModal()">
      SignIn
    </button -->
    <a @click="showModal()">Communities</a>
    <ModalCommunities
      v-show="isModalVisible"
      @close="closeModal"
    >
      <template v-slot:header>Communities</template>
      <template v-slot:sub-title>Because, because</template>
      <template v-slot:body>
        <ul>
          <li v-for="item in getCommunityList()"><a @click="onClickGoPoint(item.lon,item.lat)">{{item.name}}</a></li>
        </ul>
      </template>
      <template v-slot:footer>
        Communities
      </template>
    </ModalCommunities>

  </div>
</template>
<script>

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
