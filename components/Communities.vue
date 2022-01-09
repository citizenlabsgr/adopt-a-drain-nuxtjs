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
          <li v-for="item in getCommunityList()">{{item.name}}</li>
        </ul>
        <!-- button id="signin" class="button" @click="onSignIn ()" :disabled="isDisabled()">
          SignIn
        </button -->
      </template>
      <template v-slot:footer>
        Communities
      </template>
    </ModalCommunities>

  </div>
</template>
<script>

import Expiration from '@/components/mixins/ExpirationMixin.js'
import { Constants } from '@/components/mixins/Constants.js'
import DataWorld from '@/components/mixins/DataWorldMixin.js'

// Modals
import ModalCommunities from '@/components/Modal.vue'
/* istanbul ignore next */
export default {
  mixins: [Expiration, DataWorld],
  components: {
    ModalCommunities,
  },
  data () {
    return {
      name: "Communities",
      isModalVisible:false,
      // list: [{name: 'xxxxxxx'}]
    }
  },
  mounted () {
    console.log(`
        (*)
         |
      [mounted Communities]
         |`);

      this.loadCommunityList();
  },
  methods: {
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
