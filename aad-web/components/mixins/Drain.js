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
  constructor (json_object) {
    //console.log('Drain 1')
    this.data = json_object; //JSON.parse(JSON.stringify(json_object)); // make copy
    //console.log('Drain 2')
    this.marker = null;
    this.info_window = null;
    //console.log('Drain out')
    this.marker_listener = null;
  }
  getData() {return this.data; }

  getId() {return this.data.drain_id;}

  getKey() {

    return this.data.adopter_key;
  }

  getLat() {return this.data.lat;}
  getLon() {return this.data.lon;}

  getName() {return this.data.name;}
  setName(name) {this.data.name = name; return this;}

  getType() {return this.data.type; }
  setType(type) {this.data.type = type; return this;}

  hideMarker() {this.marker.setMap(null); this.setMarker(null);}
  //showMarker(map) {this.marker.setMap(map); return this; }

  setMarker(marker) {this.marker = marker; return this;}
  getMarker() {return this.marker;}
  setMarkerListener(listener) {this.marker_listener = listener; return this;}
  getMarkerListener(listener) {return this.marker_listener;}
  //setInfoWindow(info_window) {this.info_window = info_window;return this;}

}
export { Drain }
