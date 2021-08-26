<template>
  <div class="inner-div">
    <br/>
    <h1 class="title">
      {{ page.title }}
    </h1>
    <hr/>
    <h2 class="subtitle">
      {{ page.subtitle }}
    </h2>
  </div>
</template>

<script>

export default {

  data () {
    return {
      page: {
        title: 'Account',
        subtitle: 'Your Information x'
      }
    }
  } // end of data
}
</script>

<style scoped>
.band {
  width: 100%;

}
</style>
