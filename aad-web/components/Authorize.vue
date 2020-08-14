<template>
  <div class="band">
    <h1 class="title">
      {{ page.title }}
    </h1>
    <p>
      <label class="subtitle">{{ page.subtitle }}</label>
    </p>
    <div v-if="authenticated">
      Authorize
      <button @click="$store.commit('set_authenticated', false)">
        {{ $store.state.authenticated }}
      </button>
    </div>
    <div v-else>
      <p>
        <input v-model="form.displayname" placeholder="display name">
      </p>
      <div v-if="error_displayname" class="error">
        Your screen name.
      </div>
      <p>
        <input v-model="form.name" placeholder="email">
      </p>
      <div v-if="error_email" class="error">
        Please provide a valid email.
      </div>
      <p>
        <input v-model="form.password" type="password" placeholder="password">
      </p>
      <div v-if="error_password" class="error">
        <dl>
          <dt>letters (uppercase and lowercase)</dt>
          <dt>numbers and symbols</dt>
          <dt>minimum of 8 characters</dt>
        </dl>
      </div>
      <!-- button @click="$store.commit('set_authenticated',true)" -->
      <button @click="onSubmit ()" :disabled="isDisabled">
        Sign Up
      </button>
    </div>
  </div>
</template>
<script>
// TODO: add AAD_
// TODO: add authentication (test, code, doc)
// TODO: add authorization (tests, code, doc)
// TODO: add AAD_API_TOKEN to environment (test, code, doc)
// TODO: add AAD_API_URL to environment (test, code, doc)
// DONE: add AAD_API_VERSION to environment (test, code, doc)

import { AADHandlers } from './mixins/AADHandlers.js'

export default {
  data () {
    return {
      page: {
        title: 'Sign Up',
        subtitle: 'Because.'
      },
      form: {
        displayname: '',
        name: '',
        password: ''
      }
    }
  },
  computed: {
    error_displayname () { // true when not compliant
      return this.form.displayname.trim().length < 4
    },
    error_email () { // true when not compliant
      return !/\S+@\S+\.\S+/.test(this.form.name.trim())
    },
    error_password () { // true when not compliant
      return !/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/.test(this.form.password.trim())
    },
    isDisabled () {
      // return (this.error_displayname && this.error_email && this.error_password)
      // return this.error_displayname
      // return this.error_email
      return this.error_password || this.error_email || this.error_displayname
    },
    authenticated () {
      // if ( !this.$store.state.authenticated ){ return false }
      return false
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
      return process.env.AAD_API_URL + '/adopter'
    },
    aadBody () {
      return JSON.stringify(this.form)
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
    /*
    adopter () {
      return JSON.stringify(this.form)
    },
    */
    isValidForm () {
      if (this.form.displayname.length === 0) {
        return false
      }
      return true
    },
    onSubmit () {
      if (!this.isValidForm()) {
        this.feedBack('display name, email and password, please!')
        return undefined
      }
      // aadAdopter (aadURL, aadHeader, aadBody)
      this.aadHandlers.aadAdopter(this.aadUrl, this.aadHeader, this.aadBody)
        .then((response) => {

          if (response.status === 200) {
            this.feedBack('Welcome')
            this.feedBack(response)
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
