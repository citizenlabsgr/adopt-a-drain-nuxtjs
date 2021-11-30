/*
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
class Drain {
  constructor () {
    this.data=false; 
    this.key=false;
    this.marker = null;
    this.info_window = null;
    // listen for clicks on marker
    this.marker_listener = null;
    this.map = null;
  }
  /*
  constructor (chelate, map) {
    // json_object {}
    if (!chelate.form ) {
      throw new Error('Drain chelate is missing form!');
    }

    if (!chelate.form.drain_id) {
      throw new Error('Drain missing drain_id!');
    }
    
    this.data = chelate.form; //JSON.parse(JSON.stringify(json_object)); // make copy
    this.key = chelate.owner;
    this.marker = null;
    this.info_window = null;
    // listen for clicks on marker
    this.marker_listener = null;
    this.map = map;
  }
  */
  getData() {
    return this.data;
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
    this.data = form;
    return this;
  }
  /*
  getData() {return this.data; }
  setData(json_object) {
    this.data = json_object;
    return this;
  }
  */
  getId() {return this.data.drain_id;}

  setId(key, drain_id) {
    this.data.drain_id='adoptee#' + key + '#' + drain_id;
    return this;
  }

  getKey() {
    return this.key;
  }
  setKey(key) { // id the user
    this.key = key;
    return this;
  }

  getLat() {return this.data.lat;}
  getLon() {return this.data.lon;}

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

  getName() {return this.data.name;}
  setName(name) {this.data.name = name; return this;}

  getType() {return this.data.type; }
  setType(type) {this.data.type = type; return this;}

  hideMarker() {this.marker.setMap(null); this.setMarker(null);}
  //showMarker(map) {this.marker.setMap(map); return this; }
  removeListener(){
    if (this.marker_listener) {
       google.maps.event.removeListener(this.marker_listener );
    }
  }
setMarker(marker) {

    //set marker
    this.removeListener();

    this.marker = marker;

    return this;
  }

  getMarker() {return this.marker;}

  setIcon(image) {
    this.getMarker().setIcon(image);
    return this;
  }

  setMarkerListener(info_window, form) {
    const info_win=info_window;
    const marker = this.getMarker();
    if (this.marker_listener) {
       google.maps.event.removeListener(this.marker_listener );
    }
    //this.marker_listener = listener;
    this.marker_listener=google.maps.event.addListener(
      marker,
      "click",
      function() {
        info_win.setContent(form)
        info_win.open(this.map, marker)
      });

    return this;
  }
  getMarkerListener(listener) {return this.marker_listener;}

}
export { Drain }
