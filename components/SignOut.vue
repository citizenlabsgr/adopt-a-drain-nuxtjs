
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
      adopter_token: this.$store.state.token
    }
  },
  watch: {
    adopter_token: function () {
      this.$store.commit('attempt_expiration')
    },
  },
  methods: {
    onSignOut () {
      this.$store.commit('detoken')
    }
  }
}
</script>

<style scoped>

</style>
