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
              "name": "title",
              "value": "description"
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
    getOpportunitySingleRows() {
      // convert items into rows
      return this.getServiceSingleRows(this.opportunityService);
      // return {};
    },
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

      // clear list for reload
      let handler = new ResponseHelper(response);

      handler.resetOutput(this.getServiceList(this.opportunityService));

      handler.transfer(this.getServiceMapping(this.opportunityService),
                       this.getServiceList(this.opportunityService));
    }

  }
}
