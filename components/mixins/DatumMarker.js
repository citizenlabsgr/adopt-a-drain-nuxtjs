import { Datum } from './Datum.js';
import { InfoHelper } from './InfoHelper.js';
// always call detach() when releasing to garbage collection 
class MarkerDatum extends Datum {
  // Marker Wrapper 
  constructor (id, data, key, toggle_state, image, component) {
    super(id, data, key);

    this.setToggleState(toggle_state);
    const const_info_window = component.info_window;
    const const_data = this.data;
    const size = new component.google.maps.Size(27.0, 38.0);
    const origin = new component.google.maps.Point(0, 0);
    const anchor = new component.google.maps.Point(13.0, 18.0);
    const marker_image = image;
    let markerImage = new component.google.maps.MarkerImage(
      marker_image,
      size,
      origin,
      anchor);
      
    this.marker = new component.google.maps.Marker({
      icon: markerImage,
      position: {lat: data.lat, lng: data.lon}
    });
    const const_marker = this.marker;
    const const_map = component.map;
    const const_form = new InfoHelper(component.isAuthenticated).form(this);
    this.marker_listener=google.maps.event.addListener(
      this.marker,
      "click",
      function() {
        const_info_window.setContent(const_form);
        const_info_window.open(const_map, const_marker);
      });
  }

  /////////////////
  // Marker Methods
  ///////
  setMap(map) {this.marker.setMap(map); return this;}
  getMap() {return this.marker.getMap(); }
  
  show(map) {
    this.setMap(map);
  }
  hide() {
    this.setMap(null);
  }
  removeListener(){
    if (this.marker_listener) {
       google.maps.event.removeListener(this.marker_listener );
       this.marker_listener = null;
    }
  }
  detach() {
    // call before deallocating to garbage collection
    this.hide();
    this.removeListener();
    this.data=null;
  }

}
export { MarkerDatum }