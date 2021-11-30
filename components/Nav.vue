<template>
  <nav>
    <ul>
  
      <li>
        <nuxt-link to="/">
          Map
        </nuxt-link>
      </li>
      <li v-if="!isAuthenticated">
      
        <nuxt-link to="/authenticate">
          SignIn
        </nuxt-link>
      </li>
      <li v-else>
        <nuxt-link to="/authenticate">
          SignOut
        </nuxt-link>
      </li>
      
      <li v-if="isAuthenticated">
        <nuxt-link to="/account">
        Account
        </nuxt-link>
      </li>
      <li v-else>
        <nuxt-link to="/account">
        SignUp
        </nuxt-link>
      </li>
    </ul>
  </nav>
</template>

<script>
// import { Token Helper } from '@/components/mixins/Token Helper.js'
import Expiration from '@/components/mixins/ExpirationMixin.js'
/* istanbul ignore next */ 
export default {
  mixins: [Expiration],
  data () {
    return {
      title: 'Sponsors',
      subtitle: 'We can\'t do this alone.'
    }
  },
  computed: {
    salutation () {
      if (this.$store.state.authenticated) {
        return `xxx this.$store.state.user.name ${this.Authenticated}`
        // return this.$store.state.user.name
      }
      return ''
    }
    /*
    adopter_token_helper () {
      // Objective: Give user feedback about signin status
      // Stratgey: use the adopter name stashed in adopter token
      // Strategy: use the adopter's identity key to color code drain symbols
      // console.log('this.$store', this.$store);
      // console.log('this.$store.state',this.$store.state);
      // console.log('this.$store.state.token',this.$store.state.token);

      return new Token Helper(this.$store.state.token)
    },
    is Authenticated () {
      return new Token Helper(this.$store.state.token).is Authenticated();
    }
    */
    /*
    is Authenticated () {
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
