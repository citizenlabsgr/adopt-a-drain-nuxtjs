<template>
  <section class="container">
    <Account :owner="this.getOwner()" :id="this.getId()" @upsert="upsert"/>
  </section>
</template>
<script>
import atob from 'atob'

import Expiration from '@/components/mixins/ExpirationMixin.js'
import { AADHandlers } from '@/components/mixins/AADHandlers.js'
import Account from '@/components/Account.vue'
export default {
  mixins: [Expiration],
  components: {
    Account
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
    upsert(owner, id, form) {
      console.log('[upsert]');
      // insert 
      if (id === '0') {
         console.log('   (form) -->');
         this.addAdopter(form);
      } else if (id !== '0') { // update
         // id is the original id not one based on form changes
         this.updateAdopter(owner, id, form);
      }
    },
    addAdopter(form) { // ('signup', aadHeader, form)
      console.log('[addAdopter]');
      // [Setup Authorization]
      const aadHeader = {
        "Accept":"application/json",
        'Authorization': `Bearer ${process.env.AAD_API_TOKEN}`,
        'Content-Type': 'application/json'
      };
      // [Assemble Route and User data]
      const aadUrl = process.env.AAD_API_URL + '/signup';

      // [Store new user data]
    
      console.log('   (url,header,form) -->');

      new AADHandlers(this).aadAdopterPost(aadUrl, aadHeader, form)
        .then((response) => {
          if (response.status === 200) {
            
            switch(response.data.status) {
              case '200':
                console.log('Welcome');
                this.$router.push('authenticate');
                break;
              case '409':
                console.log('You already have an account');
                break;
              default:
                console.error('Not sure what just happened');
                console.error('response', response.data);
            }
          } else {
            console.error('Whoa, I did not see that comming (%s)!'.replace('%s', response.status))
          }
        })
        .catch((err) => {
          console.error('add adopter 2 aadUrl', aadUrl)      
          console.error('add adopter 2 aadHeader', aadHeader)
          console.error('add adopter 2 adopter', adopter)
          console.error('Something unexpected happened (%s)!'.replace('%s', err))
        })
        
    },
    updateAdopter(owner, id, form) {
      console.log('[updateAdopter]');
      // [Setup Authorization]
      const aadHeader = {
        "Accept":"application/json",
        'Authorization': `Bearer ${this.adopter_token}`,
        'Content-Type': 'application/json'
      };
      const aadUrl = `/adopter/${owner}/${id}`;

      console.log('   (url, header, form) -->');
      delete form['password'];
      new AADHandlers(this).aadAdopterPut(aadUrl, aadHeader, form)
        .then((response) => {
          if (response.status === 200) {
            
            switch(response.data.status) {
              case '200':
                console.log('Thanks for the update');
                
                if (this.payload.user !== response.data.updation.form.username) {
                  console.log('Force logout');
                  this.$store.commit('detoken');
                  this.$router.push('authenticate');
                }
                break;
              case '409':
                console.log('You already have an account');
                break;
              default:
                console.error('Not sure what just happened');
                console.error('  response', response.data);
                console.error('put adopter 2 aadUrl', aadUrl);
                console.error('put adopter 2 aadHeader', aadHeader);
                // console.error('put adopter 2 form', form);
            }
          } else {
            console.error('Whoa, I did not see that comming (%s)!'.replace('%s', response.status));
          }
        })
        .catch((err) => {
          console.error('put adopter 2 aadUrl', aadUrl);      
          console.error('put adopter 2 aadHeader', aadHeader);
          console.error('put adopter 2 form', form);
          console.error('Something unexpected happened (%s)!'.replace('%s', err));
        })
      
    }
    
  }

}
</script>
