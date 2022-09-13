<template>

    <br>

    <div class="input-group input-group-lg">
      <span class="input-group-text" id="inputGroup-sizing-lg">Global ID</span>
      <input v-model="subject" @change="refreshAndCalcEntity(subject)" type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg">
    </div>
    
    <br>

    <div class="container">
      <div class="row">
        <div class="col-sm triples">Triples in Total: {{ countraw }} </div>
        <div class="col-sm triples">Triples filtered: {{ countfilteredraw }} </div>
        <div class="col-sm triples">Triples in Cluster: {{ countfusion }} </div>
      </div>
    </div>

    <br> 

    <table class="table table-sm table-striped table-hover table-bordered">
      <caption>Predicates and Objects of Global Id</caption>

      <tbody>
        <tr v-for="pred in cluster" v-bind:key="pred">
          <td style="width: 10%;"><a v-bind:href="pred.name">{{pred.name}}</a> </td>

          <td class="tableCol"> 
            <table>
              <tr v-for="obj in pred.objects" v-bind:key="obj">
                <td class="tableCol">{{obj.name}}</td>
                <td class="tableCol"><a v-for="prov in obj.provs" :key="prov" :href="prov">{{prov}}</a></td>
              </tr>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  <!-- <div v-for="(pred, obj) in cluster" v-bind:pred="pred">
     {{ obj.das }} {{ pred }}
     <br>
  </div> -->
  <!-- <ul>
    <li v-for="item in cluster"></li>
  </ul> -->
  
</template>

<script>
import { feedStore, getPredsAndObjects, getStoreSize} from './store';
import { fetchUrl, turtleTest } from './fetchUrl'

export default {
  name: 'LD_Browser',
  props: {
    msg: String
  },
  data() {
    return {
        api: "http://api.dbpedia.link/retrieve/proxy",
        sameThing: "https://global.dbpedia.org/same-thing/lookup/?uri=",
        subject: 'https://global.dbpedia.org/id/2wvzs',
        locals: [],
        cluster: [],
        countraw: 0,
        countfilteredraw: 0,
        countfusion: 0
    }
  },
  methods: {
    async calcCluster(){
          let vm = this;

          const response = await fetch(vm.sameThing+encodeURIComponent(vm.subject), { 
            mode: 'cors',
          })

          let data = await response.json()
          vm.subject = data["global"]
          vm.locals = data["locals"]

          let contentType = response.headers.get("Content-Type")
          console.log(contentType)
          console.log(vm.subject)

          for (const local of this.locals){
            this.calcEntity(local)
          }
    },
    async refreshAndCalcEntity(url){
          this.locals = []
          this.cluster = []
          this.countraw = 0
          this.countfusion = 0
          this.countfilteredraw = 0

          this.calcEntity(url)
    },
    async calcEntity(url) {
          console.log(url)
          let newUrl = this.api + '?iri=' + encodeURIComponent (url)
          console.log(newUrl)
          let rdfData = await fetchUrl(newUrl)
          // url ="http://example.com/jane"
          let rdfData2 = turtleTest()
          console.log(rdfData2)
          let store = await feedStore(rdfData)

          let size = getStoreSize(store)
          this.countraw += size

          let quadstream = getPredsAndObjects(store, url)

          for (const quad of quadstream) {
              this.countfilteredraw += 1;

              let pre = this.cluster.find(el => el.name === quad.predicate.id)

              if(pre == undefined){
                this.cluster.push({
                  name: quad.predicate.id,
                  objects: [{
                    name: quad.object.id,
                    provs: [quad.subject.id]
                  }]
                })

                this.countfusion +=1
              } else {
                if(pre.objects.find(obj => obj.name === quad.object.id)){
                  pre.objects.find(obj => obj.name === quad.object.id)[0].prov.push(quad.subject.id)
                } else {
                  pre.objects.push({
                    name: quad.object.id,
                    provs: [quad.subject.id]
                  })
                  this.countfusion +=1
                }
              }
              

          }
          console.log(this.cluster)
          console.log(size)
    }
  },
  async created() {
    // this.calcEntity("https://www.imdb.com/title/tt0068646/?pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=1a264172-ae11-42e4-8ef7-7fed1973bb8f&pf_rd_r=P8QYTAA0STCVRRBQDBRP&pf_rd_s=center-1&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_tt_2")
    this.calcCluster(this.subject)
  },
  
}
</script>

Add "scoped" attribute to limit CSS to this component only 
<style scoped>
.tableCol {
  width: 25%
}
.triples {
  padding-top: .75rem;
  padding-bottom: .75rem;
  background-color: rgba(86,61,124,.15);
  border: 1px solid rgba(86,61,124,.2);
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
