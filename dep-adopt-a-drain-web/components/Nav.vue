<template>
  <nav>
    <ul>
      <li>
        <nuxt-link to="/">
          Home
        </nuxt-link>
      </li>
      <!-- li><nuxt-link to="/adopt">Adopt</nuxt-link></li -->
      <li>
        <nuxt-link to="/login">
          Login
        </nuxt-link>
      </li>
      <!-- li v-if="authorized"><button @click="$store.commit('set_authenticated',false)">Sign Out</button></li -->
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
    authorized () {
      // if ( !this.$store.state.authenticated ){ return false }
      return true
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
}
</style>
