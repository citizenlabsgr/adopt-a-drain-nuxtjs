import atob from 'atob';
import { DatumDictionary } from '@/components/mixins/datum/DatumDictionary.js'

export default {
  data () {
    return {
      name: 'DatumDictionaryMixin',
      datumDictionary: new DatumDictionary()
    };
  },
  methods: {
    getDictionary() {
      return this.datumDictionary.getDictionary();
    },
    addDatum(datum) {
      this.datumDictionary.addDatum(datum);
    },

    cleanDatumCache(mbr) {
      this.datumDictionary.cleanCache(mbr);

    },

    datumCount() {
      return this.datumDictionary.datumCount();
    },

    getDatum(datumId) {
      return this.datumDictionary.getDatum(datumId);
    }
  } // methods
}
