import { ResponseHelper } from '@/components/mixins/ResponseHelper.js';
// import DEFAULTS from "../sponsor/defaults.json";

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
      let row = {}; // {row: 0};
      let k = 0;

      for (let item of this.getServiceList(this.statisticService)) {
        // process items that start with item... skip other items

        if (item && item.name.startsWith('item')) {
          // Find the End (aka the beginging) of the group of items
          // the first item's name always ends with 0

          switch (k) {   // name
            case 0:
              row = {};
              row['name'] = item.value ;
              k++;
              break;
            case 1:        // value
              row['value'] = item.value;
              k--;
              rows.push(JSON.parse(JSON.stringify(row)));
              break;
          }
        }
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

      const owner = '0'; // this.payload.key;
      const aadUrl = `${process.env.AAD_API_URL}/page/${owner}/PK/${this.statisticService}`;
      const aadHeader = this.aadHeaderGuest;
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
    },

    statisticGetHandler (response) {

      let handler = new ResponseHelper(response);
      switch (handler.status()) {
        case '200':
          // clear list for reload
          handler.resetOutput(this.getServiceList(this.statisticService));
          // add data to List
          handler.transfer(this.getServiceMapping(this.statisticService),
            this.getServiceList(this.statisticService));

          break;
        case '404':
          console.warn(`Statistic data not found. ${handler.status()}`);
          break;
        default:
          console.warn(`Unknown Statistic data error...${handler.status()}`);
      }
    }
  }
}
