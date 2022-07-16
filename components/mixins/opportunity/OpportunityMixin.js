// import LogoVue from "../../Logo.vue";
import { ResponseHelper } from '@/components/mixins/ResponseHelper.js';

export default {
  data () {
    return {
      name: "OpportunityMixin",
      opportunity: {
        response: [
          {
            "id": "id", 
            "title": "title", 
            "description": "description" 
          }
        ],
        mapping: [{
            "id": "id", 
            "title": "title", 
            "description": "description" 
          }
        ],
        output: [
          {
            "id": "id", 
            "title": "title", 
            "description": "description" 
          }
        ]
      },
      service: {
        opportunity: {
          response: [
            {
              "id": "id", 
              "title": "title", 
              "description": "description" 
            }
          ],
          mapping: {
              "id": "id", 
              "title": "title", 
              "description": "description" 
          },
          output: {
            opportunityList: [
              {
                "id": "id", 
                "title": "title", 
                "description": "description" 
              }
            ]
          }
        }
      }
    }
  }, 

  methods: {
    getOpportunityList() {
      return this.service.opportunity.output.opportunityList;
    },

    getOpportunityMapping() {
      return this.service.opportunity.mapping;
    },
    
    async opportunityGetRequest () {
          /*
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
                data: dwData });
        */      
       return await this.tempResponse()
    },
    
    opportunityGetHandler (response) {
          // clear list for reload
          let handler = new ResponseHelper(response);
          
          handler.resetOutput(this.getOpportunityList());
          
          handler.transfer(this.getOpportunityMapping(), this.getOpportunityList());
           
    },
    tempResponse() {
      return {
          config:{
              "method": "get"
          },
          data: {
              "msg": "OK",
              "selection": [
                { 
                  id: "1", 
                  title: "a", 
                  description: "Beginners and Experts" 
                },
                { 
                  id: "2", 
                  title: "b", 
                  description: "Coders" 
                },
                { 
                  id: "3", 
                  title: "c", 
                  description: "Domain Experts" 
                },
                { 
                  id: "4", 
                  title: "d", 
                  description: "Designers" 
                },
                { 
                  id: "5", 
                  title: "e", 
                  description: "Developers" 
                },
                { 
                  id: "6", 
                  title: "f", 
                  description: "Hackers" 
                },
                { 
                  id: "7", 
                  title: "g", 
                  description: "Speakers" 
                },
                { 
                  id: "8", 
                  title: "h", 
                  description: "Teachers" 
                },
                { 
                  id: "9", 
                  title: "i", 
                  description: "Testers" 
                },
                { 
                  id: "10", 
                  title: "j", 
                  description: "Writers" 
                }
              ],
              "status": "200"
          },
          headers: {},
          request: {},
          status: 200,
          statusText: "OK"
        }
     }
  } 
}
