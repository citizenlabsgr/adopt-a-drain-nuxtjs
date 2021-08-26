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
      <input id="username" v-model="aadform.name" placeholder="email">
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
  </div>
</template>

<script>

import { Constants } from './mixins/Constants.js'
import { AADHandlers } from './mixins/AADHandlers.js'
import { TokenHelper } from './mixins/TokenHelper.js'

export default {

  data () {
    return {
      page: {
        title: 'Sign In',
        subtitle: 'Because'
      },
      aadform: {
        name: '',
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
      return (Constants.user_name().test(this.aadform.name.trim()))
    },
    status_username () {
      return (this.is_username ? "Ok" : "Required")
    },
  }, // end of computed
  methods: {
    log (msg) {
      /* eslint-disable no-console */
      console.log(msg)
      /* eslint-enable no-console */
    },
    onSignIn () {
      this.aadHandlers.aadSignin(this.aadUrl, this.aadHeader, this.aadBody)
        .then((response) => {
          if (response.status === 200) {
            //this.feedBack('Go find a drain to adopt!')
            this.setToken(response.data.token)
            this.setExpiresAt(new TokenHelper(response.data.token).getExpiration())
          } else {
            //this.feedBack('Whoa, I did not see this comming (%s)!'.replace('%s', response.status))
            //this.log('Whoa, I did not see this comming (%s)!'.replace('%s', response.status))
            /* eslint-disable no-console */
            console.log('Whoa, I did not see this comming (%s)!'.replace('%s', response.status))
            /* eslint-enable no-console */

          }
        })
        .catch((err) => {
          this.detoken()
          if (err.message.includes('403')) {
            /* eslint-disable no-console */
            console.log('Have you signed up?')
            /* eslint-enable no-console */
          } else {
            /* eslint-disable no-console */
            console.log('Something unexpected happened while searching (%s)!'.replace('%s', err))
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
    detoken () {
      this.$store.commit('detoken')
    }

  }
}
</script>

<style scoped>

</style>
