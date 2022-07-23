// import LogoVue from "../../Logo.vue";
import { ResponseHelper } from '@/components/mixins/ResponseHelper.js';

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
              "id": "id",
              "title": "title",
              "description": "description"
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

    async opportunityGetRequest () {
      /*
      const aadUrl = `${process.env.AAD_API_URL}/page/${this.opportunityService}`;

      const aadHeader = this.aadHeaderUser;

      // return await this.get(url, headers);
      return await this.$axios({
        url: aadUrl,
        method: 'get',
        headers: aadHeader});
        */
       return await this.tempResponse()
    },

    opportunityGetHandler (response) {
      // clear list for reload
      let handler = new ResponseHelper(response);

      handler.resetOutput(this.getServiceList(this.opportunityService));
      handler.transfer(this.getServiceMapping(this.opportunityService),
                       this.getServiceList(this.opportunityService));
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
