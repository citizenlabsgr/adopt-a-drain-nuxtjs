<template>
  <section class="container">
    <Home />
  </section>
</template>

<script>

import Home from '~/components/Home.vue'
export default {
  components: {
    Home
  },
  /*
  methods: {
    addAdopter(adopter) {
      console.log('app add adopter 1')
      
      // [Setup Authorization]
      const aadHeader = {
        "Accept":"application/json",
        'Authorization': `Bearer ${process.env.AAD_API_TOKEN}`,
        'Content-Type': 'application/json'
      };
      // [Assemble Route and User data]
      const aadUrl = process.env.AAD_API_URL + '/signup';
      //const aadBody = JSON.stringify(this.aadform);
      
      console.log('add app adopter 2 aadUrl', aadUrl)      
      console.log('add app adopter 2 aadHeader', aadHeader)
      console.log('add app adopter 2 adopter', adopter)

      // [Store new user data]
      
      new AADHandlers(this).aadAdopterPost(aadUrl, aadHeader, adopter)
        .then((response) => {
          if (response.status === 200) {
            // console.log('response', response.data);
            
            switch(response.data.status) {
              case '200':
                this.log('Welcome');
                // this.setFeedback('Welcome');
                break;
              case '409':
                this.log('You already have an account');
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
          //this.setFeedback('Something unexpected happened while searching (%s)!'.replace('%s', err))
          console.log('Something unexpected happened (%s)!'.replace('%s', err))
        })
        
    },
     updateAdopter() {
      console.log('update adopter 1')
      // [Setup Authorization]
      console.log('update adopter 2 need store user token')
      const aadHeader = {
        "Accept":"application/json",
        'Authorization': `Bearer ${process.env.AAD_API_TOKEN}`,
        'Content-Type': 'application/json'
      };
      console.log('update adopter 2 aadHeader', aadHeader)
      
    }
    
  }
  */
}
</script>
