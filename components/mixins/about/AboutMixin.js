import LogoVue from "../../Logo.vue";
import { ResponseHelper } from "../ResponseHelper";

export default {
  data () {
    return {
      name: "AboutMixin",
      aboutService: "about",
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
          output: [
            {
              "id": "A",
              "title": "LGROW",
              "description": "Lower Grand River Organization Watersheds"
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
    getAboutList() {
      return this.getServiceList(this.aboutService);
    },
    // getAboutMapping() {
    //   return this.getServiceMapping(this.aboutService);
    // },
    resetAboutList() {
      this.resetServiceList(this.aboutService).length = 0;
     },
    addAboutDatum(datum) {
      this.addServiceDatum(this.aboutService, datum);
    },

    async aboutGetRequest () {
      /*
      const aadUrl = `${process.env.AAD_API_URL}/page/${this.aboutService}`;

      const aadHeader = this.aadHeaderUser;

      // return await this.get(url, headers);
      return await this.$axios({
        url: aadUrl,
        method: 'get',
        headers: aadHeader});
        */
       return await this.tempResponse()
    },

    aboutGetHandler (response) {
      // console.log('aboutGetHandler response ', response);
          let handler = new ResponseHelper(response);

          handler.resetOutput(this.getServiceList(this.aboutService));
          handler.transfer(this.getServiceMapping(this.aboutService),
                           this.getServiceList(this.aboutService));
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
