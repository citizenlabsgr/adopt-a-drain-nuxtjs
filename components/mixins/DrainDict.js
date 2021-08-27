class DrainDict {
  constructor () {
    this.dict = {};
    this.length = 0;
  }

  contains(id) {
    //console.log('contains 1');
    if (this.dict[id] ) {
       return true ;
    }
    return false;
  }

  getData() {return this.dict}

  delete(drain_id) {
    if (this.dict[drain_id]) {
      delete this.dict[drain_id];
      return true;
    }
    return false
  }

  add(drain) {
    if (! this.dict[drain.getId()] ) {
       this.length++;
       //console.log('DrainDict.add  id: ' + drain.getId() + ' new '+ drain.getType() + ' len: '+ this.length);
       this.dict[drain.getId()]=drain;
    }
    return this;
  }

  get(drain_id) {
    if (this.dict[drain_id]) {
      return this.dict[drain_id];
    }
    return undefined
  }
  /*
  log() {
    for (no in this.dict) {
      console.log('drain ' + no)
    }
    return this;
  }
  */
}

export { DrainDict }
