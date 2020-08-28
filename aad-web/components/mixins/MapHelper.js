class MapHelper {
  constructor (component) {
    // component is the nuxt component
    this.component = component
    this.dropAnimation = component.google.maps.Animation.DROP
    //this.map = undefined
    //this.map = new component.google.maps.Map(document.getElementById("map"), mapOptions);
    this.map = component.$refs.mapRef.$mapObject
    this.set('randy', 'Y')
    this.set('center', component.$refs.mapRef.$mapObject.getCenter())

  }

  set(key, value) {
    this.component.settings.options[key] = value
  }

  get(key) {
    return this.component.settings.options[key]
  }

  settings( key, value ) {
     this.component.settings[key] = value
  }

  getting( key ) {
    return this.component.settings[key]
  }

  feedback( msg ) {
     this.component.feedback(msg)
  }

  log( msg ) {
     this.component.log(msg)
  }

  google() {
    return this.component.google
  }

  getMaxArea(){
    return this.component.settings.max_center_box_area
  }

  getBounds() {
    return this.map.getBounds()
  }

  boxify ( pnt ) {
    // Objective: keep data download from getting too big
    // Strategy: create screen center box when no google map obj is available
    // screen handling
    // generate a box from a point
    const dx = 0.006319284439086914
    const dy = 0.0021590927669254967
    const centerBox = {
      west: pnt.lng() - (dx / 2.0),
      east: pnt.lng() + (dx / 2.0),
      north: pnt.lat() + (dy / 2.0),
      south: pnt.lat() - (dy / 2.0)
    }
    return centerBox
  }

  viewBox ( box ) {
    // Objective: keep data download from getting too big
    // Strategy: expand or shrink box until a maximum area is just found
    // assume box is too big ... so make smaller first
    box = JSON.stringify(box)

    box = JSON.parse(box)

    const bumpSize = 0.01 // growth ratio
    const dy = box.north - box.south
    const dx = (Math.abs(box.west) - Math.abs(box.east))
    let area_ = dy * dx
    let bumpY = dy * bumpSize
    let bumpX = dx * bumpSize

    // make smaller
    while (area_ > this.getMaxArea()) {
      box.north -= bumpY
      box.south += bumpY
      box.west += bumpX
      box.east -= bumpX
      area_ = (box.north - box.south) * (Math.abs(box.west) - Math.abs(box.east))
    }

    // make just a little bigger
    while (area_ < this.getMaxArea()) {
      box.north += bumpY
      box.south -= bumpY
      box.west -= bumpX
      box.east += bumpX
      area_ = (box.north - box.south) * (Math.abs(box.west) - Math.abs(box.east))
    }
    return box
  }

  markerImage ( drain ) {
    // Objective: visually differentiate Orphan, Adoptee, and your Adoptee
    const size = new this.component.google.maps.Size(27.0, 38.0);
    const origin = new this.component.google.maps.Point(0, 0);
    const anchor = new this.component.google.maps.Point(13.0, 18.0);

    let image = undefined
    if (drain.type === 'adoptee') {
      image = new this.component.google.maps.MarkerImage(
        '/adoptee.svg',
        size,
        origin,
        anchor);
    } else if (drain.type === 'your_adoptee') {
      image = new this.component.google.maps.MarkerImage(
        '/your-adoptee.svg',
        size,
        origin,
        anchor);
    } else {
      image = new this.component.google.maps.MarkerImage(
        '/orphan.svg',
        size,
        origin,
        anchor);
    }
    return image
  }
  marker( form ) {
    // Objective: Hide the details of creating a marker
    return new this.component.google.maps.Marker(form)
  }

}

export { MapHelper }
