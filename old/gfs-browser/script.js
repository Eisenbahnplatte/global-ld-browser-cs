//import VueRouter from 'vue-router';
//Vue.use(VueRouter);

let router = new VueRouter({
    mode: 'history',
    routes: []
})

Vue.component('v-select', VueSelect.VueSelect);

let myApp = new Vue({
    router,
    el: '#parent',
    data: {
        api: "http://api.dbpedia.link/retrieve/",
        sameThing: "https://global.dbpedia.org/same-thing/lookup/?uri=",
        subject: 'https://global.dbpedia.org/id/2wvzs',
        predicate: "http://www.w3.org/2000/01/rdf-schema#label",
        locals: [],
        totalValuesCnt: 0,
        labels: [],
        prefusion: [],
        context: {},
        source: 'general',
        changed: false,
        labelsLang: 'en',
        targetLabelsLang: 'en',
        targetLabels: { 'generla': 'general'},
        rawTableData: [],
        tableData: [],
        aliasMap: {
            "https://databus.dbpedia.org/dbpedia/generic/" : "wikipedia",
            "https://databus.dbpedia.org/dbpedia/mappings/" : "wikipedia",
            "https://databus.dbpedia.org/dbpedia/wikidata/" : "wikidata",
            "https://databus.dbpedia.org/jj-author/dnb/" : "dnb",
            "https://databus.dbpedia.org/jj-author/kb/" : "kb",
            "https://databus.dbpedia.org/vehnem/musicbrainz/" : "musicbrainz",
            "https://databus.dbpedia.org/kurzum/cleaned-data/": "geonames"
        }
    },
    created() {
        let vm = this
        vm.subject = vm.$route.query.s || vm.subject
        vm.predicate = vm.$route.query.p || vm.predicate
        vm.$http.get(vm.sameThing+encodeURIComponent(vm.subject)).then(function(data) {    
            vm.subject = data.body["global"] || vm.subject
            vm.locals = data.body["locals"] || []
            
            vm.calcCluster()
        }, function (error) {
            console.log('failed same thing service')
        });
    },
    mounted() {
        // called when visible (hidden)
    },
    computed: {
        newTable() {
            let vm = this
            console.log(vm.locals)
            return vm.prefusion.map( function (doc) {
                sourceSet = new Set()
                _ops = doc['o'].sort( function (a,b) {
                    av = a['object']['@language'] || a['object']['@value'] || a['object']['@id']
                    bv = b['object']['@language'] || b['object']['@value'] || b['object']['@id']
                    return (av === bv) ? 0 : ((av > bv) ? 1 : -1);
                }).sort( function (a,b) {
                    av = a['prov'].length
                    bv = b['prov'].length
                    return (av === bv) ? 0 : ((av > bv) ? -1 : 1);
                }).map( function (doc_o) {
                    vm.totalValuesCnt += 1
                    values = vm.renderValue(doc_o['object'])
                    sources = doc_o['prov'].map( function (prov) {
                        source = prov['s_prov']['@id']
                        sourceSet.add(source)
                        return '<a target="_blank" href="'+source+'">'+source+'</a>'
                    })
                    return {
                        'values': values,
                        'prov': sources.join(" | ")
                    };
                })
                valuesCount = _ops.length
                sourceCount = sourceSet.size
                _pre = '<a target="_blank" href="'+doc['p']+'">'+doc['p']+'</a>'
                //_pre_stats = "<strong>"+doc['p']+"</strong>: "+valuesCount+" value(s) @ "+sourceCount+" resource(s)"
                _pre_stats = valuesCount+" value(s) @ "+sourceCount+" source(s)"
                return {'pre_stats': _pre_stats, 'pre': _pre, 'ops': _ops};
            });
        },
    },
    methods: {
        async calcCluster(){
            let vm = this

            let data = vm.getTestRDF()

            console.log("jetzt")
            let quadStream = await rdf.fetchTestTurtle()
            console.log("jetzt")
            console.log(quadStream)

            for (const quad of quadStream){
                console.log(quad)
            }

            // for (const local of vm.locals) {
            //     vm.$http.get(vm.api+'proxy?iri='+encodeURI(local)).then(function(data) {

            //     });
            // }
        },
        getTestRDF(){
            let turtleStr= `@prefix schema: <http://schema.org/> .
            <http://example.com/jane>
              schema:address [
                schema:addressLocality "Seattle" ;
                schema:addressRegion "WA" ;
                schema:postalCode "98052" ;
                schema:streetAddress "20341 Whitworth Institute 405 N. Whitworth" ;
                a schema:PostalAddress
              ] ;
              schema:colleague <http://www.xyz.edu/students/alicejones.html>, <http://www.xyz.edu/students/bobsmith.html> ;
              schema:email "mailto:jane-doe@xyz.edu" ;
              schema:image <https://json-ld.org/playground/janedoe.jpg> ;
              schema:jobTitle "Professor" ;
              schema:name "Jane Doe" ;
              schema:telephone "(425) 123-4567" ;
              schema:url <http://www.janedoe.com> ;
              a schema:Person .
              `;

            return turtleStr;
        },
    },
    watch: {
    }
})
