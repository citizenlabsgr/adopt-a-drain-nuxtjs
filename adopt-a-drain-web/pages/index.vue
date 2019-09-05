<template>
  <section class="container">
    <Header />
    <Home />
    <Footer />
  </section>
</template>

<script>
import Header from '~/components/Header.vue'
import Home from '~/components/Home.vue'
import Footer from '~/components/Footer.vue'
export default {
  components: {
    Header,
    Home,
    Footer
  }
}
</script>
