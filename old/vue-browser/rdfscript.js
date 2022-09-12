import { createApp } from 'vue'
  
console.log(createApp)
createApp({
  data() {
    return {
      message: 'Hello Vue!'
    }
  }
}).mount('#app')