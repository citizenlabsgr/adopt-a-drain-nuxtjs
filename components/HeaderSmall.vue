<template>
    <div>
       <title>
          {{ title }}
       </title>
       <hr/>
       <sub>
          {{ subtitle }}
       </sub>
    </div>
</template>

<script>
export default {
  name: 'HeaderSmall',
  props: {
    title: {
      type: String,
      default: 'title'
    },
    subtitle: {
      type: String,
      default: 'subtitle'
    }
  }
}
</script>

<style scoped>
sub {
  font-weight: 300;
  font-size: 21px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
  margin-bottom: 10px;
}
</style>
