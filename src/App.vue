<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import store from './store/index.js';

export default {
  name: 'App',
  store,
};
</script>

<style>
</style>
