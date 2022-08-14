// import LogoVue from "../../Logo.vue";
import { ResponseHelper } from '@/components/mixins/ResponseHelper.js';
import DEFAULTS from "../about/defaults.json";

export default {
  data () {
    return {
      name: "OpportunityMixin",
      opportunityService: "opportunity",
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
            "id": "form.id",
            "name": "form.name",
            "value": "form.value"
          },
          output: [
            {
              "id": "id",
              "title": "title",
              "description": "description"
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

    getOpportunityList() {
      return this.getServiceList(this.opportunityService);
    },
    resetOpportunityList() {
      this.resetServiceList(this.opportunityService).length = 0;
    },
    addOpportunityDatum(datum) {
      this.addServiceDatum(this.opportunityService, datum);
    },
    /*
    async opportunityGetRequest () {

      const aadUrl = `${process.env.AAD_API_URL}/page/${this.opportunityService}`;

      const aadHeader = this.aadHeaderUser;

      // return await this.get(url, headers);
      return await this.$axios({
        url: aadUrl,
        method: 'get',
        headers: aadHeader});

       return await this.tempResponse()
    },
    */
    async opportunityGetRequest () {
      const owner = '0'; // this.payload.key;
      const aadUrl = `${process.env.AAD_API_URL}/page/${owner}/PK/${this.opportunityService}`;
      const aadHeader = this.aadHeaderGuest;
      // console.log('aadUrl ', aadUrl);
      try {
        return await this.$axios({
          url: aadUrl,
          method: 'get',
          headers: aadHeader
        });
      } catch(err) {
        console.error(`opportunityGetRequest err ${err}`);
        console.log('Opportunity API call failed... providing defaults.');
        // return this.service.about.defaults;
        const DEFAULTS = require('./defaults.json');
        return DEFAULTS.GET;
      }
    },
    opportunityGetHandler (response) {
      console.log('opportunityGetHandler 1');
      console.log('opportunityGetHandler 1 response ', response);

      // clear list for reload
      let handler = new ResponseHelper(response);
      console.log('opportunityGetHandler 2');

      handler.resetOutput(this.getServiceList(this.opportunityService));
      console.log('opportunityGetHandler 3');

      handler.transfer(this.getServiceMapping(this.opportunityService),
                       this.getServiceList(this.opportunityService));
      console.log('opportunityGetHandler out');

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
     */
  }
}
