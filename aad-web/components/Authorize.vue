<template>
  <div class="band">
    <h1 class="title">
      {{ page.title }}
    </h1>
    <p>
      <label class="subtitle">{{ page.subtitle }}</label>
    </p>
    <p>&nbsp;</p>
    <div v-if="!isAuthenticated">
      <p>
        <input v-model="aadform.displayname" placeholder="display name">
      </p>
      <p>
        <input v-model="aadform.name" placeholder="email">
      </p>
      <p>
        <input v-model="aadform.password" type="password" placeholder="password">
      </p>
      <p>&nbsp;</p>
      <button class="button" @click="onSubmit ()" :disabled="isDisabled">
        Sign Up
      </button>
    </div>
    <div v-else>
      Authorize

    </div>
  </div>
</template>
<script>

// TODO: add authentication (test, code, doc)
// DONE: add authorization (tests, code, doc)
// DONE: Fix Failed to load plugin 'nuxt'... moved form to page.form and renamed to aadform
// DONE: add AAD_API_TOKEN to environment (test, code, doc)
// DONE: add AAD_API_URL to environment (test, code, doc)
// DONE: add AAD_API_VERSION to environment (test, code, doc)
import { AADHandlers } from './mixins/AADHandlers.js'

export default {
  data () {
    return {
      page: {
        title: 'Sign Up',
        subtitle: 'Because.'
      },
      aadform: {
        displayname: '',
        name: '',
        password: ''
      }
    }
  },
  computed: {

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
      return process.env.AAD_API_URL + '/adopter'
    },
    aadBody () {
      return JSON.stringify(this.page.aadform)
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
    isValidForm () {
      if (this.aadform.displayname.length === 0) {
        return false
      }
      return true
    },
    onSubmit () {
      if (!this.isValidForm()) {
        this.feedBack('display name, email and password, please!')
        return undefined
      }
      this.aadHandlers.aadAdopter(this.aadUrl, this.aadHeader, this.aadBody)
        .then((response) => {

          if (response.status === 200) {
            this.feedBack('Welcome')
          } else {
            this.feedBack('Whoa, I did not see this comming (%s)!'.replace('%s', response.status))
            this.log('Whoa, I did not see this comming (%s)!'.replace('%s', response.status))
          }
        })
        .catch((err) => {
          this.feedBack('Something unexpected happened while searching (%s)!'.replace('%s', err))
          this.log('Something unexpected happened while searching (%s)!'.replace('%s', err))
        })
    }
  }
}
</script>

<style scoped>
.band {
  width: 100%;
}
.error {
  color: #000099;
}
</style>
