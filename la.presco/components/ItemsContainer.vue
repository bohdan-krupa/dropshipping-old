<template>
  <section>
    <h2>New collection</h2>
    <div class="items-container">
      <Item
        v-for="item in items"
        :key="item.id"
        :path="`/item/${item.id}`"
        :photo="item.imgs[0]"
        :title="item.title"
        :price="item.price"
        :isAction="item.isAction"
      />
    </div>
  </section>
</template>

<script>
  import Item from './Item'
  import data from '../assets/data'

  export default {
    data() {
      return {
        items: data
      }
    },
    components: {
      Item
    }
  }
</script>

<style lang="sass" scoped>
  h2
    text-align: center
    margin: 50px 0 0 0
    color: #555
    font-size: 35px
    font-weight: lighter

  .items-container
    display: flex
    justify-content: center
    flex-flow: wrap
    padding: 0 50px

  @media screen and (max-width: 600px)
    h2
      font-size: 30px
</style>