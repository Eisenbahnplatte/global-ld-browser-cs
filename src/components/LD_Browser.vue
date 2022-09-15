<template>

    <br>

    <div class="input-group input-group-lg global-id-input">
      <span class="input-group-text" id="inputGroup-sizing-lg">Global ID</span>
      <input v-model="subject" @change="refreshAndCalcEntity(subject)" type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg">
    </div>
    
    <br>

    <div class="container triplesData">
      <div class="row" >
        <div class="col-sm triples">Triples in Total: {{ countraw }} </div>
        <div class="col-sm triples">Triples filtered: {{ countfilteredraw }} </div>
        <div class="col-sm triples">Triples in Cluster: {{ countfusion }} </div>
        <div class="col-sm triples">Sources: {{ countSources }} </div>
        <div class="col-sm triples">Triples/Source: {{ countEntitiesAverage }} </div>
      </div>
    </div>

    <br>



    <table class="table table-sm table-striped table-hover table-bordered">
      <caption>Predicates and Objects of Global Id</caption>
      <thead>
        <th class="predicate">Predicate</th>
        <th style="width:45%">Object</th>
        <th style="width:45%">Resource</th>
      </thead>
      <tbody>
        <tr v-for="pred in cluster" v-bind:key="pred" @click="expandPred(pred)">
          <td><a v-bind:href="pred.name">{{pred.name}}</a> </td>
          <td colspan="2"> 
            <table class="subTable">
              <tr v-show="!pred.expanded">
                <td>{{pred.objects[0].name}}</td>
                <td>
                  <div v-for="prov in pred.objects[0].provs" :key="prov">
                    <a :href="prov">{{prov}}</a>
                  </div>
                </td>
              </tr>
              <tr class="expanedTR" v-show="pred.expanded" v-for="obj in pred.objects" v-bind:key="obj">
                <td>{{obj.name}}</td>
                <td>
                  <div v-for="prov in obj.provs" :key="prov">
                    <a :href="prov">{{prov}}</a>
                  </div>
                </td>
                <!-- <td><a v-for="prov in obj.provs" :key="prov" :href="prov">{{prov}}</a></td> -->
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
import { fetchUrl } from './fetchUrl'

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
        countSources: 0,
        countEntitiesAverage: 0,
        countraw: 0,
        countfilteredraw: 0,
        countfusion: 0
    }
  },
  computed:{
    showSource(sources){
      return sources.join(" | ")
    }
  },
  methods: {
    expandPred(pred){

      console.log(this.cluster.findIndex(predicate => predicate.name === pred.name ))
      let clusterPred = this.cluster.find(predicate => predicate.name === pred.name )
      
      if (!clusterPred.expanded)
        clusterPred.expanded=true
      else
        clusterPred.expanded=false
      
    },
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

          if (rdfData == undefined) {
            this.countSources += 1
            this.countEntitiesAverage = Math.round((this.countfilteredraw / this.countSources) * 10) / 10 
            return 0
          }
          // url ="http://example.com/jane"
          // let rdfData2 = turtleTest()
          // console.log(rdfData2)
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
                  expanded: false,
                  objects: [{
                    name: quad.object.id,
                    provs: [quad.subject.id]
                  }]
                })

                this.countfusion +=1
              } else {
                if(pre.objects.find(obj => obj.name === quad.object.id)){
                  console.log()
                  pre.objects.find(obj => obj.name === quad.object.id).provs.push(quad.subject.id)
                } else {
                  pre.objects.push({
                    name: quad.object.id,
                    expanded: false,
                    provs: [quad.subject.id]
                  })
                  this.countfusion +=1
                }
              }
          }

          this.countSources += 1
          this.countEntitiesAverage = Math.round((this.countfilteredraw / this.countSources) * 10) / 10 
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
.predicate {
  width: 25%;
}

.subTable {
  width: 100%
}

.subTable td {
  width: 50%;
  max-width: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.expanedTR {
  border-bottom: 1px;
  border-style: dotted;
}

.global-id-input, .triplesData{
  width: 100%;
  padding-left: 5%;
  padding-right: 5%;
}

.triples {
  padding-top: .75rem;
  padding-bottom: .75rem;
  background-color: rgba(86,61,124,.15);
  border: 1px solid rgba(86,61,124,.2);
}

/* h3 {
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
} */
</style>
