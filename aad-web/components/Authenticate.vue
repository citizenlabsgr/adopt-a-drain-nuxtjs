<template>
  <div class="band">
    <!-- Step 1 Sign In -->
    <div v-if="!isAuthenticated">
      <h1 class="title">
        {{ page[0].title }}
      </h1>
      <h2 class="subtitle">
        {{ page[0].subtitle }}
      </h2>
      <!-- User Name -->
      <span>
        <label for="username">Email</label>
      </span>
      <span>
        <input id="username" v-model="aadform.name" placeholder="email">
      </span>
      <p>&nbsp;</p>
      <!-- Password -->
      <span>
        <label for="username">Password</label>
      </span>
      <span>
        <input v-model="aadform.password" type="password" placeholder="password">
      </span>
      <p>&nbsp;</p>
      <!-- Sign In Button -->
      <div>
        <button class="button" @click="onSignIn ()" :disabled="isDisabled">
          Sign In
        </button>
      </div>
    </div>
    <!-- Step 2 Sign Out-->
    <div v-else>
      <h1 class="title">
        {{ page[1].title }}
      </h1>
      <h2 class="subtitle">
        {{ page[1].subtitle }}
      </h2>
      <button class="button" @click="onSignOut ()">Sign Out</button>
    </div>
  </div>
</template>
<script>
// TODO: add authentication (test, code, doc)
// DONE: Authenticate component tests
// DONE: Authenticate code
// DONE: add state for signin token

// import { mapMutations } from 'vuex'
import { AADHandlers } from './mixins/AADHandlers.js'

export default {
  data () {
    return {
      page: [{
        title: 'Sign In',
        subtitle: 'Because.'
      },
      {
        title: 'Sign Out',
        subtitle: 'Because.'
      }
      ],
      aadform: {
        name: '',
        password: ''
      }
    }
  },
  computed: {
    adopter_token () {
      return this.$store.state.adopter.token
    },
    isAuthenticated () {
      if ( this.$store.state.adopter.expires_at < new Date().getTime() ) {
        this.$store.commit('adopter/detoken')
      }
      return this.$store.state.adopter.authenticated
    },
    error_email () { // true when not compliant
      return !/\S+@\S+\.\S+/.test(this.aadform.name.trim())
    },
    error_password () { // true when not compliant
      return !/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/.test(this.aadform.password.trim())
    },
    isDisabled () {
      return this.error_password || this.error_email || this.error_displayname
    },
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
    }
  },
  methods: {
    log (msg) {
      /* eslint-disable no-console */
      console.log(msg)
      /* eslint-enable no-console */
    },
    feedBack (msg) {
      this.page.subtitle = msg
    },
    token (token) {
      this.$store.commit('adopter/token', token)
    },
    detoken () {
      this.$store.commit('adopter/detoken')
    },
    authenticated (boolValue) {
      this.$store.commit('adopter/authenticated', boolValue)
    },
    expires_at(time_in_min) {
      this.$store.commit('adopter/expires_at', new Date().getTime())
    },
    onSignIn () {
      this.log(this.aadUrl)
      this.log(this.aadHeader)
      this.log(this.aadBody)

      this.aadHandlers.aadSignin(this.aadUrl, this.aadHeader, this.aadBody)
        .then((response) => {
          // this.log(response)
          if (response.status === 200) {
            this.feedBack('Go find a drain to adopt!')
            this.token(response.data.token)
          } else {
            this.feedBack('Whoa, I did not see this comming (%s)!'.replace('%s', response.status))
            this.log('Whoa, I did not see this comming (%s)!'.replace('%s', response.status))
          }
        })
        .catch((err) => {
          this.detoken()
          if (err.message.includes('403')) {
            this.feedBack('Have you signed up?')
          } else {
            this.feedBack('Something unexpected happened while searching (%s)!'.replace('%s', err))
            this.log('Something unexpected happened while searching (%s)!'.replace('%s', err))
          }
        })
    },
    onSignOut () {
      this.$store.commit('adopter/detoken')
    }
  }
}
</script>

<style scoped>
.band {
  width: 100%;
}

</style>
