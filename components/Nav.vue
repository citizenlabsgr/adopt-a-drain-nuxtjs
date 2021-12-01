<template>
  <nav>
    <ul>
      <li v-if="isAuthenticated">
        <nuxt-link to="/">
          Adopt
        </nuxt-link>
      </li>
      <li v-else>
        <nuxt-link to="/">
          Adoptions
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
import Expiration from '@/components/mixins/ExpirationMixin.js'
/* istanbul ignore next */ 
export default {
  mixins: [Expiration],
  data () {
    return {
      title: 'Sponsors',
      subtitle: 'We can\'t do this alone.'
    }
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
