<template>
  <div id="home" class="band">
    <section class="section-map">
      <DrainAdoption />
    </section>
  </div>
</template>
<script>
import DrainAdoption from '@/components/Adoption.vue'
/* istanbul ignore next */ 
export default {
  components: {
    DrainAdoption
  }
}
</script>

<style scoped>
.band {
  width: 100%;
}
</style>
