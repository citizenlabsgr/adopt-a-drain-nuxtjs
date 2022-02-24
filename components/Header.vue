<template>
  <div class="band">
    <div>
      <img src="~assets/banner.png" class="img_banner">
    </div>
    <h2 class="subtitle">
      {{ page.subtitle }}
    </h2>
  </div>
</template>
<script>
import config from '@/components/config/header.json';

export default {
  data () {
    return {
      submitStatus: 'PENDING',
      page: {
        title: config.title,
        subtitle: config.subtitle
      }
    }
  }
}
</script>
<style scoped>
header {
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.band {
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  text-align: center;
}
.img_banner {
  max-width: 100%;
  max-height: 110px;
}
</style>
