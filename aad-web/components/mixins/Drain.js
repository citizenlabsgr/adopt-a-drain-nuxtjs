/*
{
  type: 'orphan' ,
  lat: 42.01,
  lon: -83.02,
  drain_id: 'GR_00000000',
  name: 'name me'
}
{"lat": 42.9688029487, "lon": -85.6761931983, "name": "abc", "type": "adoptee", "drain_id": "GR_40107671", "adopter_key": "4fb6f893-5def-4cba-8953-a22bfe3bc043"}
*/
class Drain {
  //
  constructor (json_object, map) {
    //console.log('Drain 1');
    this.data = json_object; //JSON.parse(JSON.stringify(json_object)); // make copy

    this.marker = null;
    this.info_window = null;
    // listen for click on marker
    this.marker_listener = null;
    this.map = map;
  }
  getData() {return this.data; }

  getId() {return this.data.drain_id;}

  setId(key, drain_id) {
    this.data.drain_id='adoptee#' + key + '#' + drain_id;
  }

  getKey() {

    return this.data.adopter_key;
  }
  setKey(key) {
    //console.log('setkey 1');
    this.data.adopter_key = key;
    //console.log('setkey out');
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
      //console.log('removeListener found this.marker_listener');
       google.maps.event.removeListener(this.marker_listener );
    }
  }
  /*
  .setMarker(marker, info_window
    .close()
    .setContent(form)
    .info_window.open(map, marker)
  )
  */
  //setMarker(marker, info_window, form) {
  setMarker(marker) {

    //set marker
    //console.log('setMarker 1')
    this.removeListener();

    this.marker = marker;
    //this.info_window = info_window;
    //const info_win =info_window;

    // set listener
    //this.setMarkerListener(info_window, form)
    /*
    this.marker_listener=google.maps.event.addListener(
      marker,
      "click",
      function() {
        //console.log('info_window click')
        //console.log(info_win)
        info_window.setContent(form)
        info_win.open(this.map, marker)
      });
    */
    //this.info_window=info_window;

    return this;
  }

  getMarker() {return this.marker;}

  setIcon(image) {
    this.getMarker().setIcon(image);
    return this;
  }

  setForm(form) {
    console.log('form: '+form);
  }

  setMarkerListener(info_window, form) {
    //console.log('setMarkerListener 1')
    const info_win=info_window;
    const marker = this.getMarker();
    if (this.marker_listener) {
      //console.log('setMarkerListener found this.marker_listener');
       google.maps.event.removeListener(this.marker_listener );
    }
    //this.marker_listener = listener;
    this.marker_listener=google.maps.event.addListener(
      marker,
      "click",
      function() {
        //console.log('info_window click')
        //console.log(info_win)
        info_win.setContent(form)
        info_win.open(this.map, marker)
      });

    return this;
  }
  getMarkerListener(listener) {return this.marker_listener;}
  //setInfoWindow(info_window) {this.info_window = info_window;return this;}

}
export { Drain }
