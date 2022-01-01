import { MarkerDatum } from './DatumMarker.js';
import { InfoHelper } from './InfoHelper.js';
// always call detach() when releasing to garbage collection 
class YoursDatum extends MarkerDatum {
  // Marker Wrapper 
  constructor (id, data, ownerKey, component) {
    super(id, data, ownerKey, 3, '\your-adoptee.svg',component);

  }

}
export { YoursDatum }
