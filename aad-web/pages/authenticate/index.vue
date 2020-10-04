<template>
  <section class="container">
    <!-- Authenticate v-if="!authorized" / -->
    <Authenticate />
  </section>
</template>
<script>
import Authenticate from '@/components/Authenticate.vue'
export default {
  components: {
    Authenticate
  },
  computed: {
    authorized () {
      // if ( !this.$store.state.authenticated ) { return false }
      return true
    }
  }
}
</script>
