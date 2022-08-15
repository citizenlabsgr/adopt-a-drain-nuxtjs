import { ResponseHelper } from '@/components/mixins/ResponseHelper.js';
import DEFAULTS from "../sponsor/defaults.json";

export default {
  data () {
    return {
      name: "StatisticMixin",
      statisticService: "statistic",
      service: {
        statistic: {
          response: [

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
    getStatisticRows() {
      let rows = [];
      // assemble row
      let i = 0;
      let row = false; // {row: 0};

      for (let item of this.getServiceList(this.statisticService)) {
        // process items that start with item
        if (item && item.name.startsWith('item')) {
          // Find the End (aka the beginging) of the group of items
          // the first item's name always ends with 0
          if ( item.name.endsWith('0')) {
            if (row) { // Save the first row when defined
              rows.push(row);
              row = {};
              i++;
            } else { // reset the row
              row={};
            }
          }
          // row['row']=i;
          row[item.name] = item.value;
        }
      }
      // save the final item
      if (row) {
        rows.push(row);
      }
      return rows;
    },

    getStatisticList() {
      return this.getServiceList(this.statisticService);
    },

    resetStatisticList() {
      this.resetServiceList(this.statisticService).length = 0;
    },

    addStatisticDatum(datum) {
      this.addServiceDatum(this.statisticService, datum);
    },

    async statisticGetRequest () {

      // console.log('statisticGetRequest 1');
      const owner = '0'; // this.payload.key;
      const aadUrl = `${process.env.AAD_API_URL}/page/${owner}/PK/${this.statisticService}`;
      const aadHeader = this.aadHeaderGuest;
      // console.log('aadUrl ', aadUrl);
      try {
        return await this.$axios({
          url: aadUrl,
          method: 'get',
          headers: aadHeader
        });
      } catch(err) {
        console.error(`statisticGetRequest err ${err}`);
        console.log('Statistic API call failed... providing defaults.');
        const DEFAULTS = require('./defaults.json');
        return DEFAULTS.GET;
      }

      // const DEFAULTS = require('./defaults.json');
      // return DEFAULTS.GET;
    },

    statisticGetHandler (response) {
      // console.log('statisticGetHandler 1');
      // console.log('statisticGetHandler response ', response);

      let handler = new ResponseHelper(response);
      switch (handler.status()) {
        case '200':
          // clear list for reload
          handler.resetOutput(this.getServiceList(this.statisticService));
          // add data to List
          handler.transfer(this.getServiceMapping(this.statisticService),
            this.getServiceList(this.statisticService));

          // console.log('this.getServiceList(this.statisticService) ',this.getServiceList(this.statisticService));

          break;
        case '404':
          console.warn(`Statistic data not found. ${handler.status()}`);
          break;
        default:
          console.warn(`Unknown Statistic data error...${handler.status()}`);
      }
      /*
      for (let item in this.getStatisticList()) {
        console.log('item ', this.getStatisticList()[item];
      }

       */
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
                  "form":{
                    "id": "adopt",
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

     */
  }
}
