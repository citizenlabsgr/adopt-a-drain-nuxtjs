<template>
  <nav>
    <ul>
      <li>
        <nuxt-link to="/">
          Home
        </nuxt-link>
      </li>
      <li v-if="!adopter_token_helper.isAuthenticated()">
        <nuxt-link to="/authenticate">
          SignIn
        </nuxt-link>
      </li>
      <li v-else>
        <nuxt-link to="/authenticate">
          SignOut
        </nuxt-link>
      </li>
      <li v-if="!adopter_token_helper.isAuthenticated()">
        <nuxt-link to="/authorize">
          SignUp
        </nuxt-link>
      </li>
      <li v-else>
        <nuxt-link to="/authorize">
          {{adopter_token_helper.getDisplayName()}}
        </nuxt-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import { TokenHelper } from './mixins/TokenHelper.js'

export default {

  data () {
    return {
      title: 'Sponsors',
      subtitle: 'We can\'t do this alone.'
    }
  },
  computed: {
    salutation () {
      if (this.$store.state.authenticated) {
        return this.$store.state.user.name
      }
      return ''
    },
    adopter_token_helper () {
      // Objective: Give user feedback about signin status
      // Stratgey: use the adopter name stashed in adopter token
      // Strategy: use the adopter's identity key to color code drain symbols

      return new TokenHelper(this.$store.state.token)
    }
    /*
    isAuthenticated () {
      if (this.$store.state.adopter.expires_at < new Date().getTime()) {
        this.$store.commit('detoken')
      }
      return this.$store.state.adopter.authenticated
    },
    */
  }
}
</script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

li {
  margin: 0 10px;
  font-variant: petite-caps;
}
</style>
