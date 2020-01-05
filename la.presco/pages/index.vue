<template>
  <main>
    <div class="slider">
      <div
        v-for="(slide, index) in slides"
        :key="slide"
        :style="index === slides.length - 1 ? {animationName: 'slider'} : {}"
        class="slide"
      >
        <div :class="`photo-${slide}`"></div>
      </div>
    </div>

    <ItemsContainer />
  </main>
</template>

<script>
  import Header from '../components/Header'
  import ItemsContainer from '../components/ItemsContainer'
  import Footer from '../components/Footer'

  export default {
    components: {
      Header,
      ItemsContainer,
      Footer
    },
    data() {
      return {
        slides: [1, 2],
    		polling: null
      }
    },
    methods: {
      pollData() {
        this.polling = setInterval(() => {
          let slides = this.slides
          slides.unshift(slides[slides.length - 1])
          slides.pop()
        }, 8000)
      }
    },
    created() {
	    this.pollData()
    },
    beforeDestroy() {
      clearInterval(this.polling)
    }
  }
</script>

<style lang="sass">
  .slider
    height: 100vh

    .slide
      position: absolute
      overflow-x: hidden
      width: 100%
      animation-duration: 2s
      animation-delay: 5s
      animation-fill-mode: forwards

      div
        width: 100vw
        height: 100vh
        background-size: cover
        background-position: center

    .photo-1
      background-image: url(~static/img/bg-1.jpg)

    .photo-2
      background-image: url(~static/img/bg-2.jpg)

  @keyframes slider
    from
      width: 100%
    to
      width: 0
</style>