import { nextTick } from 'vue'

export default {
    data() {
      return { 
        count: 0,
        dynamicId:100,
        isButtonDisabled:"yes",
        url:"example.org",
        someObject: {},
        author: {
            name: 'John Doe',
            books: [
              
              
          'Vue 2 - Advanced Guide',
          'Vue 3 - Basic Guide',
          'Vue 4 - The Mystery',
          ""
            ]
          },
        isActive: true,
        hasError:false
     }
    },  
    methods: {
        increment(number) {
          this.count++
          nextTick(() => {
            // access updated DOM
            console.log("asdasd")
            this.count++
          })
        }
    },
    //computed properties are cached based on their reactive dependencies. 
    //A computed property will only re-evaluate when some of its reactive dependencies have changed.
    computed: {
        //This also means the following computed property will never update, because Date.now() is not a reactive dependency:
        now() {
          return Date.now()
        },
        // a computed getter
        publishedBooksMessage() {
          // `this` points to the component instance
          return this.author.books.length > 0 ? 'Yes' : 'No'
        },

    },

    mounted() {
        const newObject = {}
        this.someObject = newObject
    
        console.log(this.newObject === this.someObject) // false
      }
}