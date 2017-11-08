<template>
  <div class="menu-item">
    <p class="menu-label">
      {{ label.name }}
    </p>
    <ul class="menu-list">
      <li v-for="item in label.items">
        <router-link :to="item.link" exact> {{ item.name }} </router-link>
        <ul v-show="item.children">
          <li v-for="child in item.children">
            <router-link :to="child.link" exact> {{ child.name }} </router-link>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'sidebar-item',
    props: [ "label" ],
  }
</script>

<style scoped>
  .menu-item {
    margin-top: 12px;
  }
</style>
