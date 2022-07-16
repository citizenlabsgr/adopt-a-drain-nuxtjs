<template>
  <section class="container">
      <Adopter :owner="this.getOwner()" :id="this.getId()" />

    <!-- Adopter :owner="this.getOwner()" :id="this.getId()" @upsert="upsert"/ -->
  </section>
</template>
<script>
import atob from 'atob'


import Expiration from '@/components/mixins/expiration/ExpirationMixin.js';
// import { RequestAdopter } from '@/components/mixins/RequestAdopter.js';
// import { ResponseAdopter } from '@/components/mixins/ResponseAdopter.js';
// import { AAD Handlers } from '@/components/mixins/AAD Handlers.js'
// import Account from '@/components/Account.vue'
import Adopter from '@/components/Adopter.vue'

export default {
  mixins: [Expiration],
  components: {
    Adopter
  },
  methods: {
    getId() {
      let rc = '0';
      if (this.isAuthenticated) { // if authenticated
        rc = this.payload.user;
      } else { // if not authenticate
        rc = '0';
      }
      const id = this.payload.user;
      return rc;
    },
    getOwner() {
      let rc = '0';
      if (this.isAuthenticated) {
        rc = this.payload.key;
      } else {
        rc = '0';
      }
      return rc;
    }
  } // methods

}
</script>
