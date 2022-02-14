// namespace prefix Adoptee is Adpt
/*
import { AADHandlers } from '@/components/mixins/AADHandlers.js'
import { DrainTypes } from '@/components/mixins/DrainTypes.js'
import { MapHelper } from '@/components/mixins/MapHelper.js'
import { InfoHelper } from '@/components/mixins/InfoHelper.js'
*/
import { OrphanDatum } from './DatumOrphan'
import { AdopteeDatum } from './DatumAdoptee'
import { YoursDatum } from './DatumYours'

/*
to use load
*/
export default {
  data () {
    return {
       // local_dictionary: { }, // you, I will kill last.
        marker_dictionary: {},
        lastResult: {},
        max_center_box_area: 0.00005,
        view_box: {},
        delay: 20,
        counter: 0,
        info_window: null,
        map: null,
        // my_adoptee_list: []
        // adptGraph: new Graph()
    }
  },

  methods: {
    getDataCount() {
        return Object.keys(this.marker_dictionary).length;
    },
  } // methods
}