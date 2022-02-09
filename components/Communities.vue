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

import Expiration from '@/components/mixins/ExpirationMixin.js'
import DataWorld from '@/components/mixins/DataWorldMixin.js'
import GoogleMapMixin from '@/components/mixins/GoogleMapMixin.js'
import CommunityListMixin from '@/components/mixins/CommunityListMixin.js'
import GraphMixin from '@/components/mixins/graph/GraphMixin.js'

// Modals
import ModalCommunities from '@/components/Modal.vue'
/* istanbul ignore next */
export default {
  mixins: [Expiration, GraphMixin, CommunityListMixin, GoogleMapMixin,ModalCommunities],
  components: {
    ModalCommunities,
  },
  data () {
    return {
      name: "Communities",
      isModalVisible:false,
      // cmmtGraph: new Graph()
    }
  },
  mounted () {
    this.addGlyph(` [${this.name}.vue ] `);
    this.addGlyph(this.start,this.start);
     this.addSpace();
    this.addGlyph(' [Init Communities ] ',' [Mount ] ');
     this.addSpace();

      // this.loadCommunityList();
      this.loadCommunityList(this.graph)
        .then((response) => {
          // console.log('loadCommunityList');
          this.responseCommunityList(response, this.graph);
           this.addSpace();
          this.addEnd();

          console.log(this.getGraph());
        })
        .catch((err) => {
          console.error('loadCommunityList ', err);
           this.addSpace();
          this.addGlyph(` [${err} ]  `);
           this.addSpace();
          this.addEnd();

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
