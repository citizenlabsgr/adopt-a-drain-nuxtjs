class DatumDictionary {

  constructor () {
    // this.datumlist = [];
    this.dictionary = {};
    this.limit = 400;
  }

  getLimit() { // limit the number of drains added
    return this.limit;
  }

  getDictionary() {
    return this.dictionary;
  }

  getDatum(datumId) {
    // console.log('getDatum b1 datumId ', datumId);
    // returns a object that contains id and data
    let rc = false;
    rc = this.dictionary[datumId];
    if (!rc) {
        rc = false;
    }
    return rc;
  }

  datumCount() {
    // return this.dictionary.length;
    return Object.keys(this.dictionary).length;
  }

  concat(datumDict) {

  }

  addDatum(datum) {
    // formContainer could be drain but doesnt have to be
    // never let drains with map stuff attached to get loaded
    // dont overwrite existing drains, those may have map info, image, and ...
    if (this.limit < this.datumCount() ) {
      return this;
    }
    if (!datum || !datum.data) {
        throw new Error('Object missing data attribute!');
    }
    // if (this.marker_dic tionary[datum.getId()]) { // replace old
    if (!this.getDatum(datum.getId())) {
        // add marker when not available
        this.dictionary[datum.getId()] = datum;
    } else {
        // replace marker when found
        // what about removing info window?
        // this.dictionary[datum.getId()].detach(); // hide old one
        // delete this.dictionary[datum.getId()]; // hide old one

        this.dictionary[datum.getId()]=datum; // replace the old one
        // the new container will get initialized later
    }
    return this;
  }

  cleanCache(centerBox) {
      //  Objective: minimize the number of drains in the application at one time
      //  Strategy: disable and remove markers not found in the centerBox
      if (this.graph) {
        this.addGlyph(this.down, this.down);
        this.addGlyph(this.down, ' [ Clean Cache ] ');
        this.addGlyph(this.down, this.down);
      }
      // this.info_window.close();
      let datum ;
      for(let i in this.dictionary) {
        datum = this.dictionary[i];
        // turn off when outside the box
        if (
          centerBox.north < datum.getLat() ||
          centerBox.south > datum.getLat() ||
          centerBox.west > datum.getLon() ||
          centerBox.east < datum.getLon()
        ) {

          // for visual effect, hide markers before deleting
          datum.hide();

          // remove drain from dictionary ... this does not delete from db
          delete this.dictionary[datum.id];

        }
      }

    }
}
export { DatumDictionary }
