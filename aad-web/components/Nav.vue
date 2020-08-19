<template>
  <nav>
    <ul>
      <li>
        <nuxt-link to="/">
          Home
        </nuxt-link>
      </li>
      <li v-if="!isAuthenticated">
        <nuxt-link to="/login">
          SignIn
        </nuxt-link>
      </li>
      <li v-else>
        <nuxt-link to="/login">
          SignOut
        </nuxt-link>
      </li>
      <li>
        <nuxt-link to="/signup">
          SignUp
        </nuxt-link>
      </li>
    </ul>
  </nav>
</template>

<script>
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
    isAuthenticated () {
      if (this.$store.state.adopter.expires_at < new Date().getTime()) {
        this.$store.commit('adopter/detoken')
      }
      return this.$store.state.adopter.authenticated
    },
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
}
</style>
