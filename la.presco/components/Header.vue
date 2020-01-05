<template>
  <header :class="{scrolled}">
    <h1>
      <NLink to="/">La Presco</NLink>
    </h1>
    <div class="options">
      <div @click="toCart" class="cart-group">
        <div class="cart"></div>
        <p v-if="cartAmount">{{cartAmount}}</p>
      </div>
      <div class="search"></div>
    </div>
  </header>
</template>

<script>
  export default {
    data() {
      return {
        scrolled: false,
        cartAmount: 0
      }
    },
    methods: {
      handleScroll() {
        this.scrolled = window.scrollY > 0
      },
      setCartAmount() {
        let existing = localStorage.getItem('cart-items')
        existing = existing ? JSON.parse(existing) : []
        
        this.cartAmount = existing.length
      },
      toCart() {
        if (this.cartAmount > 0) {
          this.$router.replace('/cart')
        }
      }
    },
    mounted () {
      this.handleScroll()
      window.addEventListener('scroll', this.handleScroll)

      this.setCartAmount()
      this.$root.$on('cart-change', this.setCartAmount)
    },
    beforeDestroy () {
      window.removeEventListener('scroll', this.handleScroll)
    }
  }
</script>

<style scoped lang="sass">
  @media screen and (max-width: 650px)
    h1
      margin-left: 30px
      justify-content: flex-start !important
      font-size: 20px
    
    .options
      margin-right: 20px !important

    .cart-group, .search
      margin: 0 20px !important

  header
    position: fixed
    width: 100%
    transition: 400ms all
    z-index: 1000

    h1
      display: flex
      justify-content: center
      text-align: center
      line-height: 80px
      text-transform: uppercase
      transition: 600ms all

      a
        color: #fff
        text-decoration: none

    .options
      display: flex
      justify-content: flex-end
      align-items: center
      height: 80px
      margin: -80px 30px 0 0
      user-select: none

      .cart-group, .search
        margin: 0 30px
        cursor: pointer

      .cart-group
        position: relative

        p
          position: absolute
          top: -7px
          right: -7px
          background: red
          width: 15px
          height: 15px
          text-align: center
          line-height: 15px
          font-size: 10px
          border-radius: 100%
          color: #FFF

      .cart, .search
        width: 20px
        height: 20px
        background: #fff
        mask-size: cover

      .cart
        mask: url(~assets/svg/shopping-cart.svg) no-repeat center

      .search
        mask: url(~assets/svg/search.svg) no-repeat center

  .scrolled
    background: #fff
    
    h1
      line-height: 60px

      a
        color: #555
        font-size: 20px

    .options
      height: 60px
      margin-top: -60px

      .cart, .search
        background: #555
</style>