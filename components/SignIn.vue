<template>
  <div class="inner-div">
    <br/>
    <h1 id="title" class="title">
      {{ page.title }}
    </h1>
    <hr/>
    <h2 class="subtitle">
      {{ page.subtitle }}
    </h2>

    <!-- ------------ -->
    <!-- User Name -->
    <!-- ------------ -->
    <div class="prompt" ><label for="username">{{meta.username.prompt}}</label></div>
    <div>
      <input id="username" v-model="aadform.username" placeholder="email">
    </div>
    <div id="error-name" :class="[is_username ? 'input_ok' : 'input_error']">{{status_username}}</div>

    <p>&nbsp;</p>
    <!-- ------------ -->
    <!-- Password -->
    <!-- ------------ -->
    <div class="prompt"><label for="password">{{meta.password.prompt}}</label></div>
    <div>
      <input id="password" v-model="aadform.password" type="password" placeholder="password">
    </div>
    <div id="error-password" :class="[is_password ? 'input_ok' : 'input_error']">{{status_password}}</div>
    <p>&nbsp;</p>
    <!-- ------------ -->
    <!-- Submit Button -->
    <!-- ------------ -->
    <div>
      <button id="signin" class="button" @click="onSignIn ()" :disabled="isDisabled">
        Sign In
      </button>
    </div>
    <div class="feedback">
      {{ page.feedback }} {{ page.center }}
    </div>
  </div>
</template>

<script>
import Expiration from '@/components/mixins/ExpirationMixin.js'
import { Constants } from '@/components/mixins/Constants.js'
import { AADHandlers } from '@/components/mixins/AADHandlers.js'
// import { Token Helper } from '@/components/mixins/Token Helper.js'
/* istanbul ignore next */ 
export default {
  mixins: [Expiration],
  data () {
    return {
      page: {
        title: 'Sign In',
        subtitle: 'Because',
        feedback: ''
      },
      aadform: {
        username: '',
        password: ''
      },
      meta: {
        username :{
          prompt:"User Name",
          status:"",
          regexp: Constants.email()
        },
        password :{
          prompt:"Password",
          status:"",
          regexp: Constants.password()
        }
      }
      //adopter_token: this.$store.state.token
    }
  },

  computed: {
    
    isDisabled () {
      return !(this.is_password && this.is_username)
    },
    is_password () { // true when not compliant, expects an email
      return (Constants.password().test(this.aadform.password.trim()))
    },
    status_password () {
      return (this.is_password ? "Ok" : "Required")
    },
    is_username () { // true when not compliant, expects an email
      return (Constants.user_name().test(this.aadform.username.trim()))
    },
    status_username () {
      return (this.is_username ? "Ok" : "Invalid")
    },
  }, // end of computed
  methods: {
    setFeedback(msg) {
      this.page.feedback = msg;
    },
    log (msg) {
      /* eslint-disable no-console */
      console.log(msg)
      /* eslint-enable no-console */
    },
    onSignIn () {

      const aadUrl = process.env.AAD_API_URL + '/signin';
      // const aadBody = JSON.stringify(this.aadform);
      const aadBody = this.aadform;

      const aadHeader = {
        "Accept":"application/json",
        'Authorization': `Bearer ${process.env.AAD_API_TOKEN}`,
        'Content-Type': 'application/json'
      };

      new AADHandlers(this).aadSignin(
          aadUrl, 
          aadHeader, 
          aadBody
        ).then((response) => {

          if (response.status === 200) {

             switch(response.data.status) {
              case '200':
                this.setToken(response.data.token);
                this.setFeedback('Go find a drain to adopt!');
                this.$router.push('/');
                break;
           
              case '404':
                console.log('No signin matching');
                this.setFeedback('Unable to find ');
                break;

              default:
                this.setFeedback('Not sure what just happened');
                console.log('Not sure what just happened');
            }
          }

        })
        .catch((err) => {
          this.detoken()
          if (err.message.includes('403')) {
            /* eslint-disable no-console */
            this.setFeedback('Have you signed up?')
            /* eslint-enable no-console */
          } else {
            /* eslint-disable no-console */
            this.setFeedback('Something unexpected happened while searching (%s)!'.replace('%s', err))

            /* eslint-enable no-console */
          }
        })
    },
    detoken () {
      this.$store.commit('detoken')
    },
    /*
    setExpiresAt(time) {
      this.$store.commit('expires _at', time)
    },
    getToken() {
      return this.$store.state.token;
    },
    */
  }
}
</script>

<style scoped>

</style>
