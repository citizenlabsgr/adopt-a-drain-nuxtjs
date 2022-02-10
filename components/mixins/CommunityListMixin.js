// import atob from 'atob';
// import { DWHandlers } from '@/components/mixins/DWHandlers.js'
export default {
  data () {
    return {
      name: 'CommunityListMixin',
      communities: []
    };
  },
  methods: {
    getCommunityList() {
      // return this.communities;
      return this.communities
    },

    async communityGetRequest() {
      if(this.graph) {
        this.addRequestService('GET','Community');
        
       // this.addGlyph(this.down,`      + - - -> [Request ${this.name}]`);
      }
      const queryStr = 'select dr_jurisdiction, count(*), avg(dr_lat) lat,avg(dr_lon) lon from %x group by dr_jurisdiction order by dr_jurisdiction'
                        .replace('%x', process.env.DW_TABLE);
      const dwToken = process.env.DW_AUTH_TOKEN;

      const dwURL = process.env.DW_DRAIN_URL;
      const dwData = { query: queryStr, includeTableSchema: false }
      const dwHeaders = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer %s'.replace('%s', dwToken)
      }

      return await this.$axios({
            url: dwURL,
            method: 'post',
            headers: dwHeaders,
            data: dwData })
          return response
      },

      communityGetHandler(response) {
        ///////////////
        // load community
        ////////
        if(this.graph) {
          // this.addSpace();
          this.addResponseService('GET','Community', this.formatOutput(response.data));
          this.addPassFail('Community');
        }
        for (let i in response.data) {
          let jur = response.data[i].dr_jurisdiction;
          let cnt = response.data[i].count;
          let lat = response.data[i].lat;
          let lon = response.data[i].lon;
          //let ln = `          this.down                   + <--- (%a,%b)`.replace('%a', jur)
          //          .replace('%b', cnt);
          //console.log(ln);
          this.communities.push({name: jur, count: cnt, lat: lat, lon:lon});
  
        } // end for
        if(this.graph) {
         this.addSpace();
         this.addGlyph(this.down,this.down, ` [ Processed ${this.communities.length} ${this.name} ] `);
        }
      },
      
    }, // methods

    

  }
