import atob from 'atob';
import { DWHandlers } from '@/components/mixins/DWHandlers.js'
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
    responseCommunityList(response, graph=false) {
      ///////////////
      // load community
      ////////
      if (graph) {
        graph.addGlyph('      | ',`                  | `);
        graph.addGlyph('      | ',`      + <- - - [Response ${this.name}] `);
      }
      for (let i in response.data) {
        let jur = response.data[i].dr_jurisdiction;
        let cnt = response.data[i].count;
        let lat = response.data[i].lat;
        let lon = response.data[i].lon;
        //let ln = `           |                    + <--- (%a,%b)`.replace('%a', jur)
        //          .replace('%b', cnt);
        //console.log(ln);
        this.communities.push({name: jur, count: cnt, lat: lat, lon:lon});

      } // end for
      if (graph) {
        graph.addGlyph('      | ',`      | `);
        graph.addGlyph('      | ','      | ', ` [ Processed ${this.communities.length} ${this.name} ] `);
      }
    },
    async loadCommunityList(graph=false) {

      if (graph) {
        graph.addGlyph('      | ',`      + - - -> [Request ${this.name}]`);
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
        }
    },

    deploadCommunityList() {
      ////
      // pull data.world parameters together
      const queryStr = 'select dr_jurisdiction, count(*), avg(dr_lat) lat,avg(dr_lon) lon from %x group by dr_jurisdiction order by dr_jurisdiction'
      .replace('%x', process.env.DW_TABLE);
      const data = { query: queryStr, includeTableSchema: false }
      const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer %s'.replace('%s', process.env.DW_AUTH_TOKEN)
      }

      console.log(`
      (DW_DRAIN_URL, dwHeaders, dwData)
         |
      [dwCommunityList]
         .
         .
         .
      `);
      // [request dataworld]
      // if (this.list.length===0) {
        new DWHandlers(this).dwCommunityList(
          process.env.DW_DRAIN_URL,
          headers,
          data)
          .then((response) => {

              console.log(`
           .
           .
           .
        (dwCommunityList response)
           |
        [Process Response] <--- +
           |                    |`);
              ///////////////
              // load community
              ////////
              for (let i in response.data) {
                let jur = response.data[i].dr_jurisdiction;
                let cnt = response.data[i].count;
                let lat = response.data[i].lat;
                let lon = response.data[i].lon;
                let ln = `           |                    + <--- (%a,%b)`.replace('%a', jur)
                          .replace('%b', cnt);
                console.log(ln);
                this.communities.push({name: jur, count: cnt, lat: lat, lon:lon});

              } // end for
              console.log(`        (community-list)
           |
           =
              `);
          })
          .catch((err) => {
                // eslint-disable no-console
                console.error('Unexpected issue loading community list!', err);
                // eslint-enable no-console
          }); // end of DWHandlers
      // } // if
    }
  }
