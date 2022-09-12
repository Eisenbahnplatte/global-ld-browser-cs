<template>
  
  <h1 style="width: 100%">
    <img alt="logo" style="height:50px;" src="https://upload.wikimedia.org/wikipedia/commons/a/ae/73424-sync-symbol.svg" /> Global Linked Data Browser
  </h1>
  <LD_Browser msg="Hello World"/>
</template>

<script>
import LD_Browser from './components/LD_Browser.vue'

export default {
  name: 'App',
  components: {
    LD_Browser
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
