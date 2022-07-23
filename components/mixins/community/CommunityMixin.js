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
            {
              "name": "name",
              "count": 0,
              "lat": 0.0,
              "lon": 0.0
            }
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
      // console.log('communityGetRequest 1');
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
          return await this.$axios({
                url: dwURL,
                method: 'post',
                headers: dwHeaders,
                data: dwData });
    },

    communityGetHandler (response) {
      let handler = new ResponseHelper(response);

      handler.resetOutput(this.getServiceList(this.communityService));
      handler.transfer(this.getServiceMapping(this.communityService),
        this.getServiceList(this.communityService));
    }
  } // methods
}
