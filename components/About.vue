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

export default {

  data () {
    return {
      about: {
        title: 'About',
        subtitle: 'We are concerned citizens.'
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
