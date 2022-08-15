import { ResponseHelper } from '@/components/mixins/ResponseHelper.js';
import DEFAULTS from "../opportunity/defaults.json";

export default {
  data () {
    return {
      name: "SponsorMixin",
      sponsorService: "sponsor",
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
            "id": "form.id",
            "name": "form.name",
            "value": "form.value"
          },
          output: [
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

    getSponsorList() {
      return this.getServiceList(this.sponsorService);
    },

    resetSponsorList() {
      this.resetServiceList(this.sponsorService).length = 0;
    },

    addSponsorDatum(datum) {
      this.addServiceDatum(this.sponsorService, datum);
    },

    async sponsorGetRequest () {
      const owner = '0'; // this.payload.key;
      const aadUrl = `${process.env.AAD_API_URL}/page/${owner}/PK/${this.sponsorService}`;
      const aadHeader = this.aadHeaderGuest;
      // console.log('aadUrl ', aadUrl);
      try {
        return await this.$axios({
          url: aadUrl,
          method: 'get',
          headers: aadHeader
        });
      } catch(err) {
        console.error(`sponsorGetRequest err ${err}`);
        console.log('Sponsor API call failed... providing defaults.');
        const DEFAULTS = require('./defaults.json');
        return DEFAULTS.GET;
      }
    },

    sponsorGetHandler (response) {
        // clear list for reload
      let handler = new ResponseHelper(response);

      handler.resetOutput(this.getServiceList(this.sponsorService));
      handler.transfer(this.getServiceMapping(this.sponsorService),
        this.getServiceList(this.sponsorService));

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
     */
  }
}
