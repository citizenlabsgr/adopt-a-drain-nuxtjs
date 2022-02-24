<template>
  <div class="band">
    <h1 class="title">
      {{ about.title }}
    </h1>
    <h2 class="subtitle">
      {{ about.subtitle }}
    </h2>
  </div>
  
</template>

<script>
// import Banner from '@/components/Banner.vue'
import config from '@/components/config/about.json';

export default {

  data () {
    return {
      about: {
        title: config.title,
        subtitle: config.subtitle
      }
    }
  }
}
</script>

<style scoped>
.band {
  width: 100%;

}
</style>
