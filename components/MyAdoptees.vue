<template>
  <div>
    <!--button type="button" class="btn" @click="showModal()">
      SignIn
    </button -->
    <a @click="showModal()">My Adoptees</a>
    <ModalMyAdoptees
      v-show="isModalVisible"
      @close="closeModal"
    >
      <template v-slot:header>My Adoptees</template>
      <template v-slot:sub-title>Because, because</template>
      <template v-slot:body>
        <ul>
          <!--li v-for="item in getMyAdopteeList(current_token, payload.key)"><a @click="onClickGoPoint(item.form.lon,item.form.lat)">{{item.form.name}}</a></li-->
          <li v-for="item in my_adoptee_list"><a @click="onClickGoPoint(item.form.lon,item.form.lat)">{{item.form.name}}</a></li>
        </ul>

      </template>
      <template v-slot:footer>
        My Adoptees
      </template>
    </ModalMyAdoptees>

  </div>
</template>
<script>

import Expiration from '@/components/mixins/ExpirationMixin.js'
import AdptHandler from '@/components/mixins/AdptHandler.js'
import GoogleMapMixin from '@/components/mixins/GoogleMapMixin.js'

// Modals
import ModalMyAdoptees from '@/components/Modal.vue'
/* istanbul ignore next */
export default {
  mixins: [Expiration, AdptHandler, GoogleMapMixin],
  components: {
    ModalMyAdoptees,
  },
  data () {
    return {
      name: "MyAdoptees",
      isModalVisible:false,
      my_adoptee_list: []
    }
  },
  mounted () {
    console.log(`
        (*)
         |
      [mounted MyAdoptees]
         |`);

      this.loadMyAdopteeList(this.current_token, this.payload.key)
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
