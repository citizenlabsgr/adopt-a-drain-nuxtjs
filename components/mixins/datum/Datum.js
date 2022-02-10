// import Marker from 'vue2-google-maps.js'
/*
Google Marker documentation
  https://developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions
{
  type: 'orphan' ,
  lat: 42.01,
  lon: -83.02,
  drain_id: 'GR_00000000',
  name: 'name me'
}
{"lat": 42.9688029487,
"lon": -85.6761931983,
"name": "abc",
"type": "adoptee",
"drain_id": "GR_40107671",
"adopter_key": "duckduckgoose"}

{"lat": 42.9688029487, "lon": -85.6761931983, "name": "abc", "type": "adoptee", "drain_id": "GR_40107671", "adopter_key": "4fb6f893-5def-4cba-8953-a22bfe3bc043"}
*/
/*
initialize with Map Helper
options are {
  id: datum_id,
  data: copy of data from api service  {
                                    type: DrainTypes.orphan ,
                                    lat: dr_lat,
                                    lon: dr_lon,
                                    drain_id: dr_asset_id,
                                    name: 'name me'
                                }
  key: the owner of the datum,
  marker_options: {
    position:
  }
}
*/

class Datum {
  constructor (id, data, ownerKey) {
    // {lat:datum.getLat(), lng:datum.getLon() }
    this.toggle_state = 0; // 0 is none, 1 is orphan, 2 is adoptee, 3 is yours
    this.id = id;
    this.data=data; // form is like {type: 'orphan',lat: 42.01,lon: -83.02,drain_id: 'GR_00000000',name: 'name me'};
    this.key=ownerKey;

  }
  // Data methods
  getId() {return this.id;}
  getLat() {return this.data.lat;} // copy found in Marker.position
  getLon() {return this.data.lon;} // copy found in Marker.position
  getName() {return this.data.name;}
  setName(name) {this.data.name = name; return this;}
  getType() {return this.data.type;}
  getKey() {return this.key;}
  getDataCopy() {
    return JSON.parse(JSON.stringify(this.data));
  }
  setData(form) {
    /*
      form is like {
        type: 'orphan',
        lat: 42.01,
        lon: -83.02,
        drain_id: 'GR_00000000',
        name: 'name me'
      };
    */
    if (!form.type) {
      throw new Error('Drain setForm form.type is missing!');
    }
    if (!form.lat) {
      throw new Error('Drain setForm form.lat is missing!');
    }
    if (!form.lon) {
      throw new Error('Drain setForm form.lon is missing!');
    }
    if (!form.drain_id) {
      throw new Error('Drain setForm form.drain_id is missing!');
    }
    if (!form.name) {
      throw new Error('Drain setForm form.name is missing!');
    }
    if (form !== this.data) {this.invalidate = true;}

    this.data = form;
    return this;
  }
  merge(form) {
    // merge form into this drain
    // updates values
    // adds missing values
    let keys = Object.keys(form)
    for (let key in keys) {
      this.data[keys[key]]=form[keys[key]];
    }

    return this;
  }
  toggleState() {
    return this.toggle_state;
  }
  setToggleState(stateNo) {
    this.toggle_state = stateNo;
    return this;
  }
}
export { Datum }
