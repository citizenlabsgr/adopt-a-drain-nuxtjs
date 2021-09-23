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

import { Constants } from '@/components/mixins/Constants.js'
import { AADHandlers } from '@/components/mixins/AADHandlers.js'
import { TokenHelper } from '@/components/mixins/TokenHelper.js'
/* istanbul ignore next */ 
export default {

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
    /*
    aadHandlers () {
      return new AADHandlers(this)
    },
    aadHeader () {
      return {
        'Authorization': 'Bearer ' + process.env.AAD_API_TOKEN,
        'Content-Type': 'application/json',
        'Content-Profile': process.env.AAD_API_VERSION,
        'Prefer': 'params=single-object'
      }
    },
    aadUrl () {
      // remove just_fail in signup
      return process.env.AAD_API_URL + '/signin'
    },
    aadBody () {
      return JSON.stringify(this.aadform)
    },
    */
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
      const aadBody = JSON.stringify(this.aadform);
      const aadHeader = {
        "Accept":"application/json",
        'Authorization': `Bearer ${process.env.AAD_API_TOKEN}`,
        'Content-Type': 'application/json'
      };
      new AADHandlers(this).aadSignin(aadUrl, aadHeader, aadBody)
        .then((response) => {

          if (response.status === 200) {

             switch(response.data.status) {
              case '200':
                // console.log('Go find a drain to adopt!');
                this.setToken(response.data.token);
                
                // let displayname = new TokenHelper(response.data.token).getDisplayName();
                let displayname = this.getToken();
                this.setFeedback('Go find a drain to adopt!');
              
                break;
           
              case '404':
                console.log('No signin matching');
                this.setFeedback('No signin matching ');
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
    setExpiresAt(time) {
      this.$store.commit('expires_at', time)
    },
    setToken (token) {
      this.$store.commit('token', token)
    },
    getToken() {
      return this.$store.state.token;
    },
    detoken () {
      this.$store.commit('detoken')
    }

  }
}
</script>

<style scoped>

</style>
