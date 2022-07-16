<template>
  <div id="home" class="band">
    <section class="section-map">
      <DrainAdoption />
    </section>
  </div>
</template>
<script>
// [.Home]:
// |not(/home)|: [*],[*]
// |/home|:

import DrainAdoption from '@/components/Adoption.vue'
/* istanbul ignore next */ 
export default {
  components: {
    DrainAdoption
  },
  data () {
    return {
      name: "Home"
    }
  }    
} 
// [Show]: /home
// |not(/home)|: Show, [*]

// [*Show]:
// [[Start]]:
// [[Map]]: map, adopt, orphan, name
// [[End]]:
// [End]:
</script>

<style scoped>
.band {
  width: 100%;
}
</style>