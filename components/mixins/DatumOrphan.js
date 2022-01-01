import { MarkerDatum } from './DatumMarker.js';

// always call detach() when releasing to garbage collection 
class OrphanDatum extends MarkerDatum {
  // Marker Wrapper 
  constructor (id, data, component) {
    super(id, data, '0', 1, '\orphan.svg',component);
    // this.toggle_state = 1;
    // this.setToggleState(1);

  }
}
export { OrphanDatum }
