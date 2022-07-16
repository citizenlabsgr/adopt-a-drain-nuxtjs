import { ResponseHelper } from '@/components/mixins/ResponseHelper.js';

export default {
  data () {
    return {
      name: "StatsMixin",
      service: {
        stats: {
          response: [
            {
              "id": "id",
              "title": "title",
              "description": "description"
            }
          ],
          mapping : {
            "id": "form.id", 
            "title": "form.title", 
            "description": "form.description",
            "count": "form.count"
          },
          output: {
            statsList: [
              {
                "id": "id", 
                "title": "title", 
                "description": "description",
                "count":0
              }
            ]
          }
        }
      }
    }
  }, 
  methods: {
    getStatsMapping() {
      return this.service.stats.mapping;
    },
    getStatsList() {
      return this.service.stats.output.statsList;
    },
    resetStatsList() {
      this.service.stats.output.statsList.length = 0;  
    },
    addStatsDatum(datum) {
      this.service.stats.output.statsList.push(datum)
    },
    async statsGetRequest () {
          /*
          example code only
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
    
    statsGetHandler (response) {
        // clear list for reload
        let handler = new ResponseHelper(response);
  
        handler.resetOutput(this.getStatsList());
        
        handler.transfer(this.getStatsMapping(), this.getStatsList());    

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
                  "form":{
                    "id": "adopter", 
                    "title": "Adopters", 
                    "description": "Drain Adopters",
                    "count":0
                  }
                },
                {
                  "form": {
                    "id": "adoptee", 
                    "title": "Adoptions", 
                    "description": "Adopted Drains",
                    "count":0
                  }
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
