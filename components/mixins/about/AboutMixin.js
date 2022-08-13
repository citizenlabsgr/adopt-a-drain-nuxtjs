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
              "name": "name",
              "value": "value"
            }
          ],
          mapping : {
            "id": "form.id",
            "name": "form.name",
            "value": "form.value"
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
    getAbout(key) {
      let rc = '*';
      for (let i of this.getAboutList()){
        // console.log('i for ', i);
        if (i.name === key) {
          rc = i.value; //this.getAboutList()[i]['value'];
          break;
        }
      }
      return rc;
    },
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
      const owner = '0'; // this.payload.key;
      const aadUrl = `${process.env.AAD_API_URL}/page/${owner}/PK/${this.aboutService}`;
      const aadHeader = this.aadHeaderGuest;
      // console.log('aadUrl ', aadUrl);
      try {
        return await this.$axios({
          url: aadUrl,
          method: 'get',
          headers: aadHeader
        });
      } catch(err) {
        console.error(`aboutGetRequest err ${err}`);
        console.log('About API call failed... providing defaults.');
        // return this.service.about.defaults;
        const DEFAULTS = require('./defaults.json');
        return DEFAULTS.GET;
      }
    },

    aboutGetHandler (response) {
      // console.log('aboutGetHandler response ', response);

      let handler = new ResponseHelper(response);

      // console.log('aboutGetRequest ', handler.status());
      // console.log('aboutGetRequest ', handler.data());

      switch (handler.status()) {
        case '200':
          // clear the list
          handler.resetOutput(this.getServiceList(this.aboutService));

          // add data to list
          handler.transfer(this.getServiceMapping(this.aboutService),
            this.getServiceList(this.aboutService));

        break;
        case '404':
          console.warn('About page not found.');
          // console.log('404 aboutGetRequest ', this.getAboutList())
        break
      }
      // else {
      //   console.log('aboutGetRequest ', this.getAboutList())
      // }
    }
    /*
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
    */
  }
}
