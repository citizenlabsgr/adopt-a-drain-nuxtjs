import { ResponseHelper } from '@/components/mixins/ResponseHelper.js';

export default {
  data () {
    return {
      name: "StatsMixin",
      statsService: "stats",
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
          output: [
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

    getStatsList() {
      return this.getServiceList(this.statsService);
    },

    resetStatsList() {
      this.resetServiceList(this.statsService).length = 0;
    },

    addStatsDatum(datum) {
      this.addServiceDatum(this.statsService, datum);
    },

    async statsGetRequest () {
          /*
        const aadUrl = `${process.env.AAD_API_URL}/page/${this.statsService}`;

        const aadHeader = this.aadHeaderUser;

        // return await this.get(url, headers);
        return await this.$axios({
          url: aadUrl,
          method: 'get',
          headers: aadHeader});
        */
       return await this.tempResponse()
    },

    statsGetHandler (response) {
      // clear list for reload
      let handler = new ResponseHelper(response);

      handler.resetOutput(this.getServiceList(this.statsService));
      handler.transfer(this.getServiceMapping(this.statsService),
        this.getServiceList(this.statsService));

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
