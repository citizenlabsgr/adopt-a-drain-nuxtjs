
import { DrainTypes } from '@/components/mixins/drain/DrainTypes.js'
import { OrphanDatum } from '@/components/mixins/datum/DatumOrphan.js'

export default {
  data () {
    return {
      name: 'DrainMixin',
      // communities: []
    };
  },
  methods: {

    async drainGetRequest(mbr) {
      if (this.graph) {
        this.addRequestService('GET', 'Drain');
      }

      const queryStr = 'select * from %x where (dr_lon > %w and dr_lon < %e) and (dr_lat > %s and dr_lat < %n)'
        .replace('%x', process.env.DW_TABLE)
        .replace('%w', mbr.west)
        .replace('%e', mbr.east)
        .replace('%n', mbr.north)
        .replace('%s', mbr.south);
        

      const dwUrl = process.env.DW_DRAIN_URL;
      const dwBody = { query: queryStr, includeTableSchema: false }
      const dwHeader = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer %s'.replace('%s', process.env.DW_AUTH_TOKEN)
      };

      return await this.$axios({
        url: dwUrl,
        method: 'post',
        headers: dwHeader,
        data: dwBody })
    },

    drainGetHandler(response) {
      if (!this.datumDictionary) {
        throw new Error('datumDictionary Not Found');
      }

      if (this.graph) {
        this.addResponseService('GET', 'Drain', this.formatOutput(response.data));
        this.addPassFail('Drain','400','404');
      }
      
      switch(response.status) {
        case 200:

              let dr = {}
              ///////////////
              // load orphans, marker, and set infowindow
              ////////
              for (let i in response.data) {

                  // turn on or add to drains
                  // turn on markers where map is null
                  let dr = response.data[i];
                  let id = dr['dr_asset_id'];
                  let _drain = false;

                  // if (this.datumDictionary) {

                    _drain =   this.getDatum(id) ;

                    if (!_drain) {

                        const data={
                            type: DrainTypes.orphan ,
                            lat: dr['dr_lat'],
                            lon: dr['dr_lon'],
                            drain_id: id,
                            name: 'name me'
                        };

                        let datum = new OrphanDatum(id, data, this);
                        this.addDatum(datum);
                    }
                  // }

              } // end for

          break;
        case 400:
          console.log('drainGetHandler 400');

          break;
        case 404:
          console.log('drainGetHandler 404');

          break;
        default:
          console.log('Bad bad really bad!!!');
      }

    },
  } // methods
}
