<template>
  <section class="container">
    <!-- Authenticate v-if="!authorized" / -->
    <Authorize />
  </section>
</template>
<script>
import Authorize from '@/components/Authorize.vue'
export default {
  components: {
    Authorize
  },
  computed: {
    authorized () {
      // if ( !this.$store.state.authenticated ) { return false }
      return true
    }
  }
}
</script>
