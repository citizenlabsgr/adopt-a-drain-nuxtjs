
export default {
  data () {
    return {
      name: "LocationMixin",
      location: false,
      service: {
        location: {
          get: {
              response: {
                "coords": {
                  "accuracy": null,
                  "altitude":null,
                  "heading":null,
                  "latitude": 0.0,
                  "longitude": 0.0,
                  "speed": 0
                },
                "timestamp": 1655548237219
              
           },
            mapping: {
              "lat": ["coords", "latitude"],
              "lng": ["coords", "longitude"]
            },
            output: {
              location: {
                "lat": 0.0,
                "lng": 0.0,
              }
            }
          }
        }
      }
    }
  },
  methods: {
    getLocation(method='get') {
      // return this.service.location.output.location;
      return this.service.location[method.toLowerCase()]['output']['location'];
    },
    getLocationMapping(key=null,method='get') {
      // mappings are name value pairs
      //   where the value is an array
      // console.log('getLocationMapping', );
      if (key !== null) {
        // returns an array of keys
        return this.service.location[method.toLowerCase()]['mapping'][key]
      }
     
      return this.service.location[method.toLowerCase()].mapping;

    },
    getLocationResponseValue(keyList, response) {
      // does not handle arrays
      let keyCount = keyList.length;
      let rc = null;
      switch(keyCount) {
        case 1:
          rc = response[keyList[0]];
          break;
        case 2:
          rc = response[keyList[0]][keyList[1]];  
          break;
        case 3:
          rc = response[keyList[0]][keyList[1]][keyList[2]]; 
          break; 
        default:
          throw Error(`LocationMixin Unhandled response key count ${keyCount}`);  
      }
      return rc;
    },
    setLocationDatum(datum, method='get') {
      this.service.location[method.toLowerCase()]['output']['location'] = datum;
    },
    async locationGetRequest (defaultCoordinate) {
      // defaultCoordinate is {lat:,lng:}
      const defaultCoord = defaultCoordinate;
      return new Promise((resolve, reject) => {

         if(!("geolocation" in navigator)) {

           reject(new Error('Geolocation is not available.'));
         }

         navigator.geolocation.getCurrentPosition(pos => {

           resolve(pos);
         }, err => {
           //reject(err);
          resolve(defaultCoord);
         });

       });
    },

    locationGetHandler(response) {
      // console.log('locationGetHandler 1');
      let datum = {};
      // console.log('getLocationMapping',this.getLocationMapping());
      for (let key in this.getLocationMapping()) {
        // console.log('locationGetHandler key', key);
        datum[key] = this.getLocationResponseValue(this.getLocationMapping(key), response);
      }

      this.setLocationDatum(datum);
      // temporay during dev
      // console.log('locationGetHandler ', this.getLocation());
      // console.log('locationGetHandler',this.getLocation());
      // console.log('locationGetHandler out');

    }
  } // methods
}
