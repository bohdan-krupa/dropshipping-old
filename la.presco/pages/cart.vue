<template>
  <div>
    <div v-if="!isPayment" class="cart-container">
      <div v-for="(cart, index) in cartItems" :key="index" class="cart-item">
        <img :src="`img/items/${cart.title}/types/${cart.type}.jpg`" alt="Cart item">

        <div class="details">
          <div class="detail">Type: {{cart.type}}</div>
          <div class="detail">Size: {{cart.size}}</div>
          <div class="detail">Price: {{cart.price * cart.quantity}}$</div>
          <div class="detail amount">
            <span>Amount:</span>
            <input v-model="cart.quantity" type="number" />
          </div>
        </div>

        <div
          @click="removeCartItem(cart.id, cart.size, cart.type)"
          class="delete"
        >+</div>
      </div>
      
      <p class="total">Total: {{total}}$</p>
      <div @click="buyItNow()" class="buy">Buy</div>
    </div>

    <div v-show="isPayment" class="payment"></div>
  </div>
</template>

<script>
  import items from '../assets/data'

  export default {
    data() {
      return {
        cartItems: [],
        isPayment: false,
        amount: []
      }
    },
    mounted() {
      this.setCartItems()

      const script = document.createElement('script')
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.PAYPAL_ID}`
      document.body.appendChild(script)
    },
    watch: {
      cartItems: {
        handler(items) {
          if (items) {
            items.forEach(item => {
              item.quantity = item.quantity > 12 ? 12 : item.quantity
              item.quantity = item.quantity < 0 ? 0 : item.quantity
            })

            localStorage.setItem('cart-items', JSON.stringify(items.slice().reverse()))
          }
        },
        deep: true
      }
    },
    computed: {
      total() {
        let _total = 0
        this.cartItems.forEach(item => {
          _total += item.price * item.quantity
        })

        return _total
      }
    },
    methods: {
      setCartItems() {
        let existing = localStorage.getItem('cart-items')
        existing = existing ? JSON.parse(existing) : []

        this.cartItems = existing.map(cartItem => {
          let item = items.find(val => {
            return val.id == cartItem.id
          })

          return {
            id: cartItem.id,
            size: cartItem.size,
            type: cartItem.type,
            quantity: cartItem.quantity,
            title: item.title,
            price: item.price
          }
        }).reverse()

        if (!this.cartItems.length) {
          this.$router.replace('/')
        }
      },
      removeCartItem(id, size, type) {
        let existing = JSON.parse(localStorage.getItem('cart-items'))

        const updateCart = existing.filter(cartItem => {
          console.log(cartItem.type != type)
          return !(cartItem.id == id && cartItem.size == size && cartItem.type == type)
        })
        localStorage.setItem('cart-items', JSON.stringify(updateCart))

        this.setCartItems()
        this.$root.$emit('cart-change')
      },
      buyItNow() {
        if (this.total > 0) {
          this.isPayment = true

          const orderItems = this.cartItems.map(item => {
            return {
              name: item.title,
              unit_amount: {
                value: item.price,
                currency_code: 'USD'
              },
              quantity: item.quantity,
              sku: `${item.id}/${item.size}/${item.type}`
            }
          })
          const total = this.total
          const toThanks = () => {
            this.$router.replace('/thanks')
          }
          
          paypal.Buttons({
            createOrder: function(data, actions) {
              return actions.order.create({
                products: {
                  name: "Nice hoody, bro",
                  description: "Just cool hoody",
                  type: "GOOD",
                  category: 'WEAR',
                  image_url: "https://bohdan-krupa.github.io/la.presco/img/items/name-2/imgs/0.jpg",
                  home_url: "https://bohdan-krupa.github.io/la.presco/item/2952561"
                },
                purchase_units: [{
                  amount: {
                      value: total,
                      currency_code: 'USD',
                      breakdown: {
                          item_total: {
                            value: total,
                            currency_code: 'USD'
                          }
                      }
                  },
                  items: orderItems
                }]
              })
            },
            onApprove: function(data, actions) {
              return actions.order.capture().then(function(details) {
                // alert('Order is completed, ' + details.payer.name.given_name)
                toThanks()
              })
            }
          }).render('.payment')
        }
      }
    }
  }
</script>

<style lang="sass" scoped>
  .cart-container
    padding-top: 80px

    .cart-item
      display: flex
      justify-content: space-between
      align-items: center
      width: 1000px
      padding: 30px 0
      margin: 0 auto
      border-bottom: 1px solid #CCC

      img
        width: 120px
        height: 120px
        object-fit: cover

      .details
        display: flex
        align-items: center

        .detail
          width: 140px
          line-height: 30px

          input
            width: 60px
            margin-left: 10px
            outline: none
            border: 1px solid #999
            border-radius: 20px
            font-size: 16px
            text-align: center
            color: #222

            &::-webkit-inner-spin-button, 
            &::-webkit-outer-spin-button
              opacity: 1

      .delete
        width: 120px
        text-align: center
        cursor: pointer
        font-size: 40px
        font-weight: lighter
        color: #000
        transform: rotateZ(45deg)

  .total
    margin-top: 50px
    text-align: center
    font-size: 25px
    font-weight: bold
    color: #555

  .buy
    width: 300px
    margin: 80px auto
    text-align: center
    border-radius: 30px
    line-height: 50px
    background: #000
    color: #FFF
    cursor: pointer
    user-select: none            

  .payment
    box-sizing: content-box
    width: 300px
    margin: 0 auto
    padding: 150px 0

  @media screen and (max-width: 1100px) and (min-width: 800px)
    .cart-item
      width: 800px !important

      img
        width: 200px !important
        height: 200px !important

      .item-options
        transform: scale(0.8)

  @media screen and (max-width: 800px)
    .cart-item
      width: 80% !important

      .details
        flex-flow: column

  @media screen and (max-width: 650px)
    .info
      flex-flow: column

      .details
        margin: 20px 0 !important
        text-align: center

  @media screen and (max-width: 550px)
    .cart-container
      .cart-item
        .details
          font-size: 12px

          .detail
            width: 120px
            line-height: 22px

        img
          width: 90px
          height: 90px

        .delete
          width: 60px
</style>