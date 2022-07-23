
import { DrainTypes } from '@/components/mixins/drain/DrainTypes.js'
import { OrphanDatum } from '@/components/mixins/datum/DatumOrphan.js'
import { ResponseHelper } from "../ResponseHelper";

export default {
  data () {
    return {
      name: "DrainMixin",
      service: {
        drain: {
          get: {
            response: {
              "data": [
                {
                  "dr_asset_id": "CGR_2009",
                  "dr_lat": 42.9606970372,
                  "dr_lon": -85.6654215022,
                  "etal":"etal"
                }
              ],
              status: 200,
              statusText: ""
            },
            mapping: {
              "type": "orphan",
              "lat": ["data", 0, "dr_lat"],
              "lon": ["data", 0, "dr_lon"],
              "drain_id": ["data", 0, "dr_asset_id"],
              "name": "name me"
            },
            output: [
              {
                "type": 'orphan',
                "lat": 42.96423911300001,
                "lon": -85.6668874744,
                "drain_id": 'CGR_2549058',
                "name": 'name me'
              }
            ]
          }
        }
      }
    }
  },
  methods: {
    getDrainList() {
      return this.service.drain.output;
      // return this.service.drain.output.drainList;
    },
    getDrainMapping() {
      return this.service.drain.mapping;
    },
    resetDrainList() {
      this.service.drain.output.length = 0;
      // this.service.drain.output.drainList.length = 0;
    },
    setDrainDatum(datum) {
      this.service.drain.output.push(datum);
      // this.service.drain.output.drainList.push(datum);
    },
    async drainGetRequest(mbr) {

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
      let handler = new ResponseHelper(response);

      // console.log('2 drainGetHandler ', response);
      // console.log('3 drainGetHandler status ', handler.status());

      switch(handler.status()) {
        case '200':
              // console.log('4 drainGetHandler ');
              let dr = {}
              ///////////////
              // load orphans, marker, and set infowindow
              ////////
              // console.log('5 drainGetHandler ', handler.data());

              for (let i in handler.data()) {

                  // turn on or add to drains
                  // turn on markers where map is null

                  let dr = handler.data()[i]; // response.data[i];
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
                        // console.log(data);

                        let datum = new OrphanDatum(id, data, this);
                        //
                        this.addDatum(datum);
                    }
                  // }

              } // end for

          break;
        case '400':
          console.log('drainGetHandler 400');

          break;
        case '404':
          console.log('drainGetHandler 404');

          break;
        default:
          console.log('Bad bad really bad!!!');
      }

    },
  } // methods
}
