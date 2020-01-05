<template>
  <NLink :to="path" class="item">
    <img class="item-photo" :src="photo" alt="Продукт" />
    <p class="item-title">{{title}}</p>
    <div class="item-price">
      <p v-if="isAction">
        <strike>{{price + price * 0.3}} $</strike>
      </p>
      <p>{{price}} $</p>
    </div>
  </NLink>
</template>

<script>
  export default {
    props: {
      path: String,
      photo: String,
      title: String,
      price: Number,
      isAction: Boolean
    }
  }
</script>

<style lang="sass" scoped>
  .item
    width: 300px
    margin: 50px
    text-decoration: none

    img
      width: 300px
      height: 300px

    .item-title
      line-height: 28px

    p
      margin-top: 10px
      text-align: center
      color: #555

  @media screen and (max-width: 500px)
    .item
      width: 250px

      img
        width: 250px
        height: 250px
</style>