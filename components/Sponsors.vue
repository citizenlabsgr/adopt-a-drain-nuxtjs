
<template>
<!-- Deprecated -->
  <div class="band">
    <h1 class="title">
      {{ title }}
    </h1>
    <h2 class="subtitle">
      {{ subtitle }}
    </h2>
    <ul>
      <li><a href="https://www.lgrow.org" target="_blank"><img src="~assets/logos/LGrow.png" class="img_sponsor"></img></a></li>
      <li><a href="https://citizenlabs.org" target="_blank"><img src="~assets/logos/citizenlabs.png" class="img_sponsor"></img></a></li>
    </ul>
  </div>
</template>

<script>
/* istanbul ignore next */
export default {
  data () {
    return {
      title: 'Sponsor',
      subtitle: 'We can\'t do this alone.'
    }
  }
}
</script>

<style scoped>

.band {
  width: 100%;
  background-color: #ffffff;
}
ul {
  list-style: none;
  padding: 0;
  margin: 0px;
  display: flex;
  flex-flow:row wrap;
  justify-content: center;
  align-items: center;
}

li {
  margin: 20px 20px;
}
.img_sponsor {
  height: 100px
}

</style>
