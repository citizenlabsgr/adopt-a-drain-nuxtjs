<template>
  <div class="band">
    <h1 class="title">
      {{ opportunities.title }}
    </h1>
    <h2 class="subtitle">
      {{ opportunities.subtitle }}
    </h2>
    <!-- custom stuff -->
    <div class="description">
      {{ opportunities.details.description }}
    </div>
    <div class="subtitle">
      {{ opportunities.details.item.title }}
    </div>
    <ul>
      <li v-for="item in opportunities.details.item.list" :key="item.id">
        {{ item.description }}
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data () {
    return {
      opportunities: {
        title: 'Opportunities',
        subtitle: 'We care about what you want to do.',
        details: {
          description: 'Are you a programmer with Nuxtjs experience who wants to help improve and maintain the Adopt a Drain application? Dont be shy! We are always seeking assistance with the code! Get involved and follow our GitHub page.',
          item: {
            title: 'Always looking for: ',
            list: [
              { id: 1, title: 'a', description: 'Beginners and Experts' },
              { id: 2, title: 'b', description: 'Coders' },
              { id: 3, title: 'c', description: 'Domain Experts' },
              { id: 4, title: 'd', description: 'Designers' },
              { id: 5, title: 'e', description: 'Developers' },
              { id: 6, title: 'f', description: 'Hackers' },
              { id: 7, title: 'g', description: 'Speakers' },
              { id: 8, title: 'h', description: 'Teachers' },
              { id: 9, title: 'i', description: 'Testers' },
              { id: 10, title: 'j', description: 'Writers' }
            ]
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.band {
  width: 100%;
}

ul {
  /* list-style: none; */
  padding: 0;
  margin: 0;
  display: flex;
  flex-flow:row wrap;
  justify-content: center;
  align-items: center;
}

li {
  margin: 0px 10px 0px 20px;
}
</style>
