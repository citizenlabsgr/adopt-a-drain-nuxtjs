<template>
  <section class="container">
  
    <Authorize @add-adopter="addAdopter"/>
  </section>
</template>
<script>
import Authorize from '@/components/Authorize.vue'
export default {
  components: {
    Authorize
  },
  methods: {
    addAdopter(adoptee) {
      console.log('addAdopter');
      console.log('Authorize/index onSubmit emit data upward to page ')
      this.$emit('add-adopter', adoptee)
    }
    
  }
}
</script>
