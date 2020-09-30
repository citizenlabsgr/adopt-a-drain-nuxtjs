class Utils {
  constructor() {
  }

  deepCopy(json_obj) {
    let newObj = JSON.parse(JSON.stringify(json_obj))
    return newObj
  }

  copyNoObjects(_obj) {
    // Objective: copy and remove an object contained in _obj
    // Strategy: scan _obj attribute by attribute and test for object type
    let _copyObj = {}
    for (name in _obj) {
      if (! (_obj[name] instanceof Object)) {
        _copyObj[name]=_obj[name]
      }
    }
    return _copyObj
  }
}

export { Utils }
