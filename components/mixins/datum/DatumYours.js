import { MarkerDatum } from '@/components/mixins/datum/DatumMarker.js';
// import { InfoHelper } from '@/components/mixins/map/InfoHelper.js';
// always call detach() when releasing to garbage collection
class YoursDatum extends MarkerDatum {
  // Marker Wrapper
  constructor (id, data, ownerKey, component) {
    super(id, data, ownerKey, 3, '\your-adoptee.svg',component);

  }

}
export { YoursDatum }
