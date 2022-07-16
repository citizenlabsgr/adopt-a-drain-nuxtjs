import { ResponseHelper } from '@/components/mixins/ResponseHelper.js';

export default {
  data () {
    return {
      name: "SponsorMixin",
      service: {
        sponsor: {
          response: [
            {
              "id": "id",
              "title": "title",
              "description": "description"
            }
          ],
          mapping : {
            "id": "id", 
            "title": "title", 
            "description": "description"
          },
          output: {
            sponsorList: [
              {
                "id": "id", 
                "title": "title", 
                "description": "description",
                "website":"website",
                "source":"source",
                "icon": "~assets/logos/LGrow.png"
              }
            ]
          }
        }
      }
    }
  }, 
  methods: {
    getSponsorMapping() {
      return this.service.sponsor.mapping;
    },
    getSponsorList() {
      return this.service.sponsor.output.sponsorList;
    },
    resetSponsorList() {
      this.service.sponsor.output.sponsorList.length = 0;  
    },
    addSponsorDatum(datum) {
      this.service.sponsor.output.sponsorList.push(datum)
    },
    async sponsorGetRequest () {
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
    
    sponsorGetHandler (response) {
        // clear list for reload
        let handler = new ResponseHelper(response);
        
        handler.resetOutput(this.getSponsorList());
        
        handler.transfer(this.getSponsorMapping(), this.getSponsorList());          
    
          /*
          this.resetSponsorList();
          
          for (let i in response.data) {
            let id = response.data[i].id;
            let title = response.data[i].title;
            let description = response.data[i].description;
            this.addSponsorDatum({id: id, title:title, description:description});

          } 
      */   
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
                  "id": "lgrow", 
                  "title": "LGROW", 
                  "description": "Lower Grand River Organization of Watersheds",
                  "website":"https://www.lgrow.org",
                  "source": "~assets/logos/LGrow.png",
                  "icon": "~assets/logos/LGrow.png"

                },
                {
                  "id": "citizenlabs", 
                  "title": "CitizenLabs", 
                  "description": "CitizenLabs",
                  "website":"https://citizenlabs.org",
                  "source": "~assets/logos/citizenlabs.png",
                  "icon": "~assets/logos/LGrow.png"
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
