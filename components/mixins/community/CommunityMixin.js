import { ResponseHelper } from '@/components/mixins/ResponseHelper.js';

export default {
  data () {
    return {
      name: "CommunityMixin",
      communityService: "community",
      service: {
        community: {
          response: [
            {
              "dr_jurisdiction": "name",
              "count": "count",
              "lat": "lat",
              "lon": "lon"
            }
          ],
          mapping: {
            "name": "dr_jurisdiction",
            "count": "count",
            "lat": "lat",
            "lon": "lon"
          },
          output: [
          ]
        }
      }
    }
  },

  computed: {
    aadHeaderGuest () {
      return {
        "Accept":"application/json",
        'Authorization': `Bearer ${process.env.AAD_API_TOKEN}`,
        'Content-Type': 'application/json'
      };
    },
    aadHeaderUser() {
      return {
        "Accept":"application/json",
        'Authorization': `Bearer ${this.current_token}`,
        'Content-Type': 'application/json'
      }
    }
  },

  methods: {
    getCommunityRows() {
      let rows = [];
      // assemble row
      let i = 0;
      let row = false; // {row: 0};

      for (let item of this.getServiceList(this.communityService)) {
        row = {"item_0": item.name, "item_1": item.count};
        rows.push(row);
      }
      return rows;
    },
    getCommunityList() {
      // return list of communities
      return this.getServiceList(this.communityService);
    },
    getCommunityMapping() {
      // return transfer mappings from service to output[]
      return this.getServiceMapping(this.communityService)
    },
    resetCommunityList() {
      // clear the output[] list
      return this.getServiceList(this.communityService)
    },

    addCommunityDatum(datum) {
      // add a single datum to output[]
      this.addServiceDatum(this.communityService, datum);
    },

    async communityGetRequest () {
      //console.log('communityGetRequest 1');
          const queryStr = 'select dr_jurisdiction, count(*), avg(dr_lat) lat,avg(dr_lon) lon from %x group by dr_jurisdiction order by dr_jurisdiction'
                            .replace('%x', process.env.DW_TABLE);
          const dwToken = process.env.DW_AUTH_TOKEN;
          const dwURL = process.env.DW_DRAIN_URL;
          const dwData = { query: queryStr, includeTableSchema: false }
          const dwHeaders = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer %s'.replace('%s', dwToken)
          }
          // post insted of guest
          try {
            return await this.$axios({
              url: dwURL,
              method: 'post',
              headers: dwHeaders,
              data: dwData
            });
          } catch(err) {
            console.log('Community API call failed... providing defaults.');

            const Defaults = require('./defaults.json');
            return Defaults.GET;
          }
    },

    communityGetHandler (response) {
      // console.log('communityGetHandler 1');
      let handler = new ResponseHelper(response);
      // console.log('communityGetHandler 2');

      // console.log('communityGetHandler response ', response);
      handler.resetOutput(this.getServiceList(this.communityService));
      // console.log('communityGetHandler 3');
      // console.log('communityGetHandler 3 this.communityService ',this.communityService);
      // console.log('communityGetHandler 3 this.communityService getServiceMapping ',this.getServiceMapping(this.communityService));
      // console.log('communityGetHandler 3 this.communityService getServiceList    ',this.getServiceList(this.communityService));

      handler.transfer(this.getServiceMapping(this.communityService),
        this.getServiceList(this.communityService));
      // console.log('communityGetHandler out');

    }
  } // methods
}
