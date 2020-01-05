<template>
  <main>
    <div v-if="!isPayment" :class="{blur: isCartItem || isSelectionError}" class="product">
      <div class="left-path">
        <img :src="mainPhoto" alt="Продукт" />
        <div class="other-imgs">
          <img
            :key="index"
            v-for="(otherImg, index) in otherImgs"
            :src="otherImg"
            @click="showPhoto(index, false)"
            :class="{'darker-border': index == selectedImg}"
            alt="Товар"
          >
        </div>
      </div>
      <div class="item-data">
        <div class="types-container">
          <p class="prop-title">Type: {{selectedType}}</p>

          <div class="types">
            <div
              v-for="(typePhoto, typeName, index) in item.types"
              :key="index"
              @click="showPhoto(typeName, true)"
              class="type"
            >
              <img :src="typePhoto" :class="{'darker-border': typeName == selectedType}" alt="Type">
            </div>
          </div>
        </div>

        <h2>{{item.title}}</h2>

        <ul class="description">
          <li v-for="(prop, propKey, index) in item.specifications" :key="index" >{{propKey}}: {{prop}}</li>
        </ul>

        <div class="sizes-container">
          <p class="prop-title">Size: {{selectedSize}}</p>

          <div class="sizes">
            <p
              v-for="(size, index) in item.sizes"
              :key="index"
              class="size"
              @click="setSize(size)"
              :class="{'darker-border': size == selectedSize}"
            >{{size}}</p>
          </div>
        </div>

        <div class="price">
          <p v-if="item.isAction">
            <strike>{{item.price + item.price * 0.3}} $</strike>
          </p>
          <p>{{item.price}} $</p>
        </div>

        <div class="item-options">
          <div @click="addToCart()">Add to cart</div>
          <div @click="cartItemShowSwitch()" class="black">Buy it now</div>
        </div>
      </div>
    </div>

    <div v-if="isCartItem && !isPayment" class="cart-item">
      <img :src="mainPhoto" alt="Cart item">

      <div class="details">
        <div class="detail">Type: {{selectedType}}</div>
        <div class="detail">Size: {{selectedSize}}</div>
        <div class="detail">Price: {{item.price * quantity}}$</div>
        <div class="detail amount">
          <span>Amount:</span>
          <input v-model="quantity" type="number" />
        </div>
      </div>

      <div class="item-options sm">
        <div @click="buyItNow()" class="black">Buy</div>
        <div @click="cartItemShowSwitch">Cancel</div>
      </div>
    </div>

    <div v-if="isSelectionError" class="selection-error">
      <p>Please, select the size and type</p>

      <div class="item-options sm">
        <div @click="isSelectionError = false" class="black">Ok</div>
      </div>
    </div>

    <div v-show="isPayment" class="payment"></div>
  </main>
</template>

<script>
  import items from '../../assets/data'

  export default {
    data() {
      return {
        item: items.find(val => {
          return val.id == this.$route.params.id
        }),
        selectedSize: null,
        isTypeSelected: false,
        selectedImg: 0,
        selectedType: null,
        isPayment: false,
        quantity: 1,
        isCartItem: false,
        isSelectionError: false
      }
    },
    watch: {
      quantity() {
        this.quantity = this.quantity > 12 ? 12 : this.quantity
        this.quantity = this.quantity < 0 ? 0 : this.quantity
      }
    },
    mounted() {
      const script = document.createElement('script')
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.PAYPAL_ID}`
      document.body.appendChild(script)
    },
    computed: {
      otherImgs() {
        return this.item.imgs
      },
      mainPhoto() {
        if (this.isTypeSelected) {
          return this.item.types[this.selectedType]
        } else {
          return this.item.imgs[this.selectedImg]
        }
      }
    },
    methods: {
      showPhoto(val, isTypeSelected) {
        this.isTypeSelected = isTypeSelected
        
        if (isTypeSelected) {
          this.selectedType = val
        } else {
          this.selectedImg = val
        }
      },
      setSize(size) {
        this.selectedSize = size
      },
      addToCart() {
        if (this.selectedSize && this.selectedType) {
          let existing = localStorage.getItem('cart-items')
          existing = existing ? JSON.parse(existing) : []
          console.log(existing)

          const newItem = {
            id: this.$route.params.id,
            size: this.selectedSize,
            type: this.selectedType,
            quantity: 1
          }
          
          if (!existing.some(old => old.id == newItem.id && old.size == newItem.size && old.type == newItem.type)) {
            existing.push(newItem)

            localStorage.setItem('cart-items', JSON.stringify(existing))
            this.$root.$emit('cart-change')
          }
        } else {
          this.isSelectionError = true
        }
      },
      cartItemShowSwitch() {
        if (this.selectedSize && this.selectedType) {
          this.isCartItem = !this.isCartItem
        } else {
          this.isSelectionError = true
        }
      },
      buyItNow() {
        if (this.quantity > 0) {
          this.isPayment = true

          const price = this.item.price
          const title = this.item.title
          const quantity = this.quantity
          const selectedSize = this.selectedSize
          const selectedType = this.selectedType
          const id = this.item.id
          const toThanks = () => {
            this.$router.replace('/thanks')
          }
          
          paypal.Buttons({
            createOrder: function(data, actions) {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                      value: price * quantity,
                      currency_code: 'USD',
                      breakdown: {
                          item_total: {
                            value: price * quantity,
                            currency_code: 'USD'
                          }
                      }
                  },
                  items: [{
                    name: title,
                    unit_amount: {
                      value: price,
                      currency_code: 'USD'
                    },
                    quantity: quantity,
                    sku: `${id}/${selectedSize}/${selectedType}`
                  }]
                }]
              })
            },
            onApprove: function(data, actions) {
              return actions.order.capture().then(function() {
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
  .blur
    filter: blur(8px)
    pointer-events: none
    user-select: none

  main    
    .product
      display: flex
      flex-flow: wrap
      padding: 100px

      .left-path
        width: 50%

        .other-imgs
          display: flex
          flex-flow: wrap
          margin-top: 20px

          img
            width: 80px
            height: 80px
            border: 1px solid #CCC
            object-fit: cover
            margin: 8px
            cursor: pointer

          .darker-border
            border-width: 1px
            border-color: #333

    img
      width: 100%

    .item-data
      display: flex
      flex-flow: column
      width: 50%

      h2
        margin-bottom: 20px
        margin-top: 30px
        text-align: center
        font-size: 30px
        color: #333
        align-self: center

      p
        font-size: 30px
        color: #333

        strike
          color: #888

      .description
        align-self: center
        line-height: 25px
        margin-top: 30px
        font-size: 16px
        color: #333
        list-style: none
        padding: 0

      .sizes-container
        margin-top: 30px

        .sizes
          display: flex
          flex-flow: wrap
          justify-content: center
          margin-top: 15px

          .size
            font-size: 14px
            color: #555
            margin: 6px
            padding: 4px 8px
            border: 1px solid #CCC
            cursor: pointer
            user-select: none

          .darker-border
            border: 1px solid #333

      .types-container
        .types
          display: flex
          flex-flow: wrap
          margin-top: 10px

          .type
            .darker-border
              border: 1px solid #333

            img
              width: 50px
              height: 50px
              border: 1px solid #CCC
              object-fit: cover
              margin: 8px
              cursor: pointer

      .prop-title
        font-size: 14px
        color: #555

      .price
        margin: 40px 0 20px 0
        align-self: flex-end

    .item-options
      width: 300px
      text-align: center
      margin: 0 auto
      user-select: none

      &.sm
        width: 150px
        margin: 0

        div
          width: 150px
          line-height: 45px

      div
        border: 1px solid #000
        border-radius: 30px
        line-height: 50px
        margin: 15px 0
        cursor: pointer

        &.black
          background: #000
          color: #fff

    .cart-item, .selection-error
      position: fixed
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
      display: flex
      justify-content: space-around
      align-items: center
      width: 1000px
      padding: 15px 0
      margin: 0 auto
      background: #FFF
      border: 1px solid #CCC
      border-radius: 30px

      &.selection-error
        width: 500px

      img
        width: 120px
        height: 120px
        object-fit: cover

      .details
        display: flex
        align-items: center

        .detail
          width: 140px

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

      .buy
        width: 150px
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

  @media screen and ( max-width: 1050px )
    main
      .cart-item
        flex-flow: column
        width: auto
        padding: 40px

        .details
          flex-flow: column
          text-align: center
          line-height: 28px
          margin: 10px 0

        .item-options
          flex-flow: row

  @media screen and ( max-width: 1000px )
    main
      .product
        .left-path
          .other-imgs img
            width: 50px
            height: 50px      

  @media screen and (max-width: 800px)
    main
      .product
        flex-flow: column
        padding: 100px 30px 20px 30px

        .left-path, .item-data
          width: 100%

          .other-imgs
            justify-content: center

          .types-container
            .types
              justify-content: center

        .item-data
          margin-top: 30px

          h2
            font-size: 24px

          .sizes-container
            margin-left: 0
            width: 100%

            .sizes

          .price 
            margin-left: auto
            margin-right: auto

            p
              text-align: center
              font-size: 25px

  @media screen and ( max-width: 550px )
    main
      .selection-error
        flex-flow: column
        width: max-content !important
        padding: 40px

        .item-options div
          margin: 30px 0 0 0
</style>