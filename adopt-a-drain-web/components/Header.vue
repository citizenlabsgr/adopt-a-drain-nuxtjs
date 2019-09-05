<template>
  <div class="header">
    <div>
      <img src="~assets/banner.png" class="img_banner">
    </div>
    <h2 class="subtitle">
      {{ page.subtitle }}
    </h2>
  </div>
</template>
<script>
export default {
  data () {
    return {
      submitStatus: 'PENDING',
      page: {
        title: 'Adopt a Drain',
        subtitle: 'Volunteer to keep street drain clear and clean.'
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
.img_banner {
  max-width: 100%;
  max-height: 110px;
}
</style>
