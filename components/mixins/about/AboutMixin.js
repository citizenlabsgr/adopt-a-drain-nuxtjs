import LogoVue from "../../Logo.vue";
import { ResponseHelper } from "../ResponseHelper";

export default {
  data () {
    return {
      name: "AboutMixin",
      service: {
        about: {
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
            aboutList: [
              {
                "id": "A", 
                "title": "LGROW", 
                "description": "Lower Grand River Organization Watersheds"
              }
            ]
          }
        }
      }
    }
  }, 
  methods: {
    getAboutMapping() {
      return this.service.about.mapping;
    },
    getAboutList() {
      return this.service.about.output.aboutList;
    },
    resetAboutList() {
      this.service.about.output.aboutList.length = 0;  
    },
    addAboutDatum(datum) {
      this.service.about.output.aboutList.push(datum)
    },
    async aboutGetRequest () {
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
    
    aboutGetHandler (response) {
          let handler = new ResponseHelper(response);
          handler.resetOutput(this.service.about.output.aboutList);
          handler.transfer(this.service.about.mapping, 
                           this.service.about.output.aboutList);
          /*
          this.resetAboutList()

          for (let i in response.data) {
            let id = response.data[i].id;
            let title = response.data[i].title;
            let description = response.data[i].description;
            
            this.addAboutDatum({id: id, title:title, description:description})
          } 
          */
         
    },
    /*
    tempResponse() {
      return {data: [
        { 
          id: 1, 
          title: 'a', 
          description: 'Item in List' 
        }
      ]};
    }
    */
   tempResponse() {
    return {
        config:{
            "method": "get"
        },
        data: {
            "msg": "OK",
            "selection": [
              {
                "id": "A", 
                "title": "LGROW", 
                "description": "A. This is a placeholder"
              },
              {
                "id": "B", 
                "title": "CitizenLabs", 
                "description": "B. This is a placeholder"
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
