import { MarkerDatum } from './DatumMarker.js';
import { InfoHelper } from './InfoHelper.js';
// always call detach() when releasing to garbage collection 
class AdopteeDatum extends MarkerDatum {
  // Marker Wrapper 
  constructor (id, data, ownerKey ,component) {
    super(id, data, ownerKey, 2, '\adoptee.svg',component);
  }

}
export { AdopteeDatum }
