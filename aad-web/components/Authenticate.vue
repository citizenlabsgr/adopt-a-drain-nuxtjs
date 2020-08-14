<template>
  <div class="band">
    <h1 class="title">
      {{ page.title }}
    </h1>
    <h2 class="subtitle">
      {{ page.subtitle }}
    </h2>
    <div v-if="authenticated">
      Authorize
      <button @click="$store.commit('set_authenticated', false)">
        {{ $store.state.authenticated }}
      </button>
    </div>
    <div v-else>
      <h1>Temporary sign in </h1>
      <!-- input v-model="adopter_name" placeholder="email" -->
      <!--input v-model="adopter_password" placeholder="password" -->

      <button @click="$store.commit('set_authenticated',true)">
        Sign In
      </button>
    </div>
  </div>
</template>
<script>
// TODO: add authentication (test, code, doc)
// TODO: add authorization (tests, code, doc)
/*
  if not authenticated
    show user login with signin button and signup button
    signup button goes to Authorize page

  else
    show user info
*/
export default {
  data () {
    return {
      page: {
        title: 'Authenticate',
        subtitle: 'Because.'
      }
    }
  },
  computed: {
    authenticated () {
      // if ( !this.$store.state.authenticated ){ return false }
      return false
    }
  }
}
</script>

<style scoped>
.band {
  width: 100%;

}
</style>
