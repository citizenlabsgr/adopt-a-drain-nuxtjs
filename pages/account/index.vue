<template>
  <section class="container">
    <Account :owner="this.getOwner()" :id="this.getId()" @upsert="upsert"/>
  </section>
</template>
<script>
import Expiration from '@/components/mixins/ExpirationMixin.js'

// import { Constants } from '@/components/mixins/Constants.js'
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
      console.log('account id ', id);
      return rc;
    },
    getOwner() {
      let rc = '0';
      if (this.isAuthenticated) {
        rc = this.payload.key;
      } else {
        rc = '0';
      }
      // const owner = this.payload.key;
      // console.log('getOwner ',owner);
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
            // console.log('response', response.data);
            
            switch(response.data.status) {
              case '200':
                console.log('Welcome');
                // console.log('token ', response);
                // this.setFeedback('Welcome');
                this.$router.push('authenticate');
                break;
              case '409':
                console.log('You already have an account');
                //this.setFeedback('Email already taken!');
                break;
              default:
                // this.setFeedback('Not sure what just happened');
                console.log('Not sure what just happened');
                console.log('response', response.data);
            }
          } else {
            //this.feedBack('Whoa, I did not see this comming (%s)!'.replace('%s', response.status))
            console.log('Whoa, I did not see that comming (%s)!'.replace('%s', response.status))
          }
        })
        .catch((err) => {
          console.log('add adopter 2 aadUrl', aadUrl)      
          console.log('add adopter 2 aadHeader', aadHeader)
          console.log('add adopter 2 adopter', adopter)
          //this.setFeedback('Something unexpected happened while searching (%s)!'.replace('%s', err))
          console.log('Something unexpected happened (%s)!'.replace('%s', err))
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
      // console.log('url ',aadUrl);
      // console.log('form ', form);
      // console.log('url, header, form')
      console.log('   (url, header, form) -->');
      new AADHandlers(this).aadAdopterPut(aadUrl, aadHeader, form)
        .then((response) => {
          if (response.status === 200) {
            // console.log('response', response.data);
            
            switch(response.data.status) {
              case '200':
                console.log('Thanks for the update');
                // console.log('token ', response);
                // this.setFeedback('Welcome');
                // console.log('aadUrl ', aadUrl);
                // console.log('payload.user', this.payload.user);
                // console.log('response.data', response.data);
                // console.log('response.data.updation.form.username', response.data.updation.form.username);

                
                if (this.payload.user !== response.data.updation.form.username) {
                  console.log('Force logout');
                  this.$store.commit('detoken');
                  this.$router.push('signin');
                }
                // this.$router.push('/');
                break;
              case '409':
                console.log('You already have an account');
                //this.setFeedback('Email already taken!');
                break;
              default:
                // this.setFeedback('Not sure what just happened');
                console.log('Not sure what just happened');
                console.log('  response', response.data);
                console.log('put adopter 2 aadUrl', aadUrl);
                console.log('put adopter 2 aadHeader', aadHeader);
                console.log('put adopter 2 form', form);
            }
          } else {
            //this.feedBack('Whoa, I did not see this comming (%s)!'.replace('%s', response.status))
            console.log('Whoa, I did not see that comming (%s)!'.replace('%s', response.status));
          }
        })
        .catch((err) => {
          console.log('put adopter 2 aadUrl', aadUrl);      
          console.log('put adopter 2 aadHeader', aadHeader);
          console.log('put adopter 2 form', form);
          //this.setFeedback('Something unexpected happened while searching (%s)!'.replace('%s', err));
          console.log('Something unexpected happened (%s)!'.replace('%s', err));
        })
       

    }
    
  }

}
</script>
