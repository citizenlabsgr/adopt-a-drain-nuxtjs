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

// import GraphMixin from '@/components/mixins/graph/GraphMixin.js'

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
    },
    /*
    upsert(owner, id, form) {
      // console.log('[upsert]');
      // insert
      if (id === '0') {
         // console.log('  (form) -->');
         this.addAdopter(form);
      } else if (id !== '0') { // update
         // id is the original id not one based on form changes
         this.updateAdopter(owner, id, form);
      }
    },
    addAdopter(form) { // ('signup', aadHeader, form)
      // console.log('[addAdopter]');
      // [Setup Authorization]

      this.clearGraph();

      new RequestAdopter(this).Post(form)
        .then((response) => {

          if (new ResponseAdopter(this).Post(response)) {
            console.log('Ok Go');
          }


          if (response.status === 200) {
            switch(response.data.status) {
              case '200':
              this.addSpace();
              this.addEnd();
                // console.log('Welcome');
                // this.$router.push('authenticate');
                break;
              case '409':
                // console.log('You already have an account');
                break;
              default:
                console.error('Not sure what just happened');
                // console.error('response', response.data);
            }
          } else {
            console.error('Whoa, I did not see that comming (%s)!'.replace('%s', response.status))
          }

          this.showGraph();
          // console.log(this.getGraph());
        })
        .catch((err) => {
          console.error('xSomething unexpected happened (%s)!'.replace('%s', err))
        })

    },
    updateAdopter(owner, id, form) {
      // console.log('[updateAdopter]');
      // [Setup Authorization]

      new RequestAdopter(this).Put(owner, id, form)
        .then((response) => {
          new ResponseAdopter(this).Put(response);

          if (response.status === 200) {

            switch(response.data.status) {
              case '200':
                // console.log('Thanks for the update');

                if (this.payload.user !== response.data.updation.form.username) {
                  // console.log('Force logout');
                  this.$store.commit('detoken');
                  this.$router.push('authenticate');
                }
                break;
              case '409':
                console.log('You already have an account');
                break;
              default:
                console.error('Not sure what just happened');
                // console.error('  response', response.data);
                // console.error('put adopter 2 aadUrl', aadUrl);
                // console.error('put adopter 2 aadHeader', aadHeader);
                // console.error('put adopter 2 form', form);
            }
          } else {
            console.error('Whoa, I did not see that comming (%s)!'.replace('%s', response.status));
          }
        })
        .catch((err) => {
          // console.error('put adopter 2 aadUrl', aadUrl);
          // console.error('put adopter 2 aadHeader', aadHeader);
          // console.error('put adopter 2 form', form);
          console.error('Something unexpected happened (%s)!'.replace('%s', err));
        })

    }
    */

  } // methods

}
</script>
