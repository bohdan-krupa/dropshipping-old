<template>
  <div>
    <Header :class="{scrolled}"/>
    <nuxt />
    <Footer />
  </div>
</template>

<script>
  import Header from '../components/Header'
  import Footer from '../components/Footer'

  export default {
    computed: {
      scrolled() {
        return this.$route.name == 'item-id' || this.$route.name == 'cart' || this.$route.name == 'payment' || this.$route.name == 'thanks'
      }
    },
    components: {
      Header,
      Footer
    }
  }
</script>

<style>
  html {
    font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
      Roboto, 'Helvetica Neue', Arial, sans-serif;
  }

  *,
  *:before,
  *:after {
    box-sizing: border-box;
    margin: 0;
    -webkit-tap-highlight-color: transparent;
  }
</style>