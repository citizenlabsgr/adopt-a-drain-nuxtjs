<template>
  <div class="band">
    <h1 class="title">
      {{ authorize.title }}
    </h1>
    <h2 class="subtitle">
      {{ authorize.subtitle }}
    </h2>
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
      <p>
        <input v-model="form.name" placeholder="email">
      </p>
      <p>
        <input v-model="form.password" type="password" placeholder="password">
      </p>
      <!-- button @click="$store.commit('set_authenticated',true)" -->
      <button @click="onSubmit ()">
        Sign In
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

/*
  if not authenticated
    show user login with signin button and signup button
    signup button goes to Authorize page

  else
    show user info

*/
import { AADHandlers } from './mixins/AADHandlers.js'

export default {
  data () {
    return {
      authorize: {
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
    authenticated () {
      // if ( !this.$store.state.authenticated ){ return false }
      return false
    },
    aadHandlers () {
      return new AADHandlers(this)
    },
    aadToken () {
      return 'Bearer ' + process.env.AAD_API_TOKEN
    },
    aadVersion () {
      return process.env.AAD_API_VERSION
    },
    aadHeader () {
      return {
        'Authorization': this.aadToken,
        'Content-Type': 'application/json',
        'Content-Profile': this.aadVersion,
        'Prefer': 'params=single-object'
      }
      // -H "Authorization: Bearer $STARTER_TOKEN" \
      // -H "Content-Type: application/json" \
      // -H "Content-Profile: aad_version_1_2_1" \
      // -H "Prefer: params=single-object" \
    }
  },
  methods: {
    log (msg) {
      /* eslint-disable no-console */
      console.log(msg)
      /* eslint-enable no-console */
    },
    adopter () {
      return JSON.stringify(this.form)
    },
    onSubmit () {
      this.log(this.adopter())
      this.log(process.env.AAD_API_TOKEN)
      this.log(process.env.AAD_API_URL)
      this.log(this.aadHeader)
    }
  }
}
</script>

<style scoped>
.band {
  width: 100%;

}
</style>
