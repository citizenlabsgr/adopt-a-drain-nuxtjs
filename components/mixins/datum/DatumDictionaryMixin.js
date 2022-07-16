// import atob from 'atob';
// import { DatumDictionary } from '@/components/mixins/datum/DatumDictionary.js'

export default {
  data () {
    return {
      name: 'DatumDictionaryMixin',
      datumDictionary: true,
      limit: 400,
      service: {
        datumDictionary: {
          input: {
            "id": "",
            "data": {
              "type": "",
                  "lat": 42.0,
                  "lon": -83.02,
                  "drain_id": "GR_00000000",
                  "name": "name me"
            },
            "ownerKey": ""
          },
          output:{
            datumDictionary: {
              "key": {
                "id": "id",
                "data": {
                  "type": "",
                  "lat": 42.0,
                  "lon": -83.02,
                  "drain_id": "GR_00000000",
                  "name": "name me"
                },
                "key": "",
                "toggle_state": 0
              } 
            }
          }
        }
      }
    }
  },
  methods: {
    addDatum(datum) {
      // formContainer could be drain but doesnt have to be
      // never let drains with map stuff attached to get loaded
      // dont overwrite existing drains, those may have map info, image, and ...
      // console.log('addDatum ', datum);
      if (this.limit < this.datumCount() ) {
        return this;
      }
  
      if (!datum || !datum.data) {
          throw new Error('Object missing data attribute!');
      }
  
      if (!this.getDatum(datum.getId())) {
          // add marker when not in dictionary
          this.service.datumDictionary.output.datumDictionary[datum.getId()] = datum;
      } else {
          // replace marker when found
          // what about removing info window?
          this.service.datumDictionary.output.datumDictionary[datum.getId()].detach(); // hide old one
  
          this.service.datumDictionary.output.datumDictionary[datum.getId()]=datum; // replace the old one
          // the new container will get initialized later
      }
  
    },
    datumCount() {
      // console.log('datumCount service ', Object.keys(this.service.datumDictionary.output.datumDictionary).length);
      return Object.keys(this.service.datumDictionary.output.datumDictionary).length;
      // return this.service.datumDictionary.output.datumDictionary.length;
    },
    cleanDatumCache(centerBox) {
      //  Objective: minimize the number of drains in the application at one time
      //  Strategy: disable and remove markers not found in the centerBox
   
      // this.info_window.close();
      let datum ;
      // console.log('getDatum A', this.getDatum('key') );
      // console.log('getDatum B', this.getDatum('xx') );
      // look for key and remove...key is a placeholder... indicates first load 
      if(this.getDatum('key')) {
        delete this.service.datumDictionary.output.datumDictionary['key'];
        return;
      }
      for(let i in this.service.datumDictionary.output.datumDictionary) {
        datum = this.service.datumDictionary.output.datumDictionary[i];
        // console.log('clean datum ', datum.id);
        // console.log('clean datum ', datum.getId());

        // turn off when outside the box
        if (
          centerBox.north < datum.getLat() ||
          centerBox.south > datum.getLat() ||
          centerBox.west > datum.getLon() ||
          centerBox.east < datum.getLon()
        ) {
          // for visual effect, hide markers before deleting
          datum.hide();
          // remove drain from dictionary ... this does not delete from db
          delete this.service.datumDictionary.output.datumDictionary[datum.id];
        }
      }
    },

    getDatumLimit() {
      return this.limit
    },

    getDatumDictionary() {
      return this.service.datumDictionary.output.datumDictionary;
    },

    getDatum(datumId) {
      //return this.service.datumDictionary.output.datumDictionary.getDatum(datumId);
      // returns a object that contains id and data
      let rc = false;
      rc = this.service.datumDictionary.output.datumDictionary[datumId];
      if (!rc) {
          rc = false;
      }
      return rc;
    }
    
  } // methods
}