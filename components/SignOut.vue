
<template>
  <div class="inner-div">
    <h1 class="title">
      {{ page.title }}
    </h1>
    <hr/>
    <h2 class="subtitle">
      {{ page.subtitle }}
    </h2>
    <button class="button" @click="onSignOut ()">
      Sign Out
    </button>
  </div>
</template>

<script>
/* istanbul ignore next */ 
export default {
  data () {
    return {
      page: {
        title: 'SignOut',
        subtitle: 'Sign Out'
      },
      current_token: this.$store.state.token
    }
  },
  watch: {
    current_token: function () {
      console.log('watch SignOut current_token')
      this.$store.commit('attempt_expiration')
    },
  },
  methods: {
    onSignOut () {
      this.$store.commit('detoken');
      this.$router.push('/'); // goto map
    }
  }
}
</script>

<style scoped>

</style>
