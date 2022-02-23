
export default {
  data () {
    return {
      name: 'CommunityMixin',
      communityList: []
    }
  }, // data
  methods: {
    getCommunityList() {
      return this.communityList;
    },
    async communityGetRequest () {

          if (this.graph) {
            this.addRequestService('GET', 'Community');
          }
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
    },

    communityGetHandler (response) {

          if (this.graph) {
            this.addResponseService('GET', 'Community', this.formatOutput(response.data));
            this.addPassFail('Community','400','404');
          }
          for (let i in response.data) {
            let jur = response.data[i].dr_jurisdiction;
            let cnt = response.data[i].count;
            let lat = response.data[i].lat;
            let lon = response.data[i].lon;

            this.communityList.push({name: jur, count: cnt, lat: lat, lon:lon});

          } // end for
          if (this.graph) {
            this.addSpace();
            this.addGlyph(this.down,this.down, ` [ Processed ${this.communityList.length} ${this.name} ] `);
          }
    }

  } // methods
}
