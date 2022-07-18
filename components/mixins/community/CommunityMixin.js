import { ResponseHelper } from '@/components/mixins/ResponseHelper.js';

export default {
  data () {
    return {
      name: "CommunityMixin",
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
          output: {
            communityList: [
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
    }
  }, 
  
  methods: {
    getCommunityList() {
      return this.service.community.output.communityList;
    },
    getCommunityMapping() {
      return this.service.community.mapping;
    },
    // getCommunityMappingKey() {
    //  return this.service.community.mapping;
    // },
    // resetCommunityList() {
    resetCommunityList() {
      this.service.community.output.communityList.length = 0;  
    },
    setCommunityDatum(datum) {
      this.service.community.output.communityList.push(datum)
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
          // console.log('communityGetHandler 1 ', response);
          let handler = new ResponseHelper(response);
          
          handler.resetOutput(this.getCommunityList());
          
          handler.transfer(this.getCommunityMapping(), this.getCommunityList());
    }
    
  } // methods
}
