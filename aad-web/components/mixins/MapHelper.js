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

  log( msg ) {
     this.component.log(msg)
  }

  google() {
    return this.component.google
  }

  getBounds() {
    return this.map.getBounds()
  }

  boxify ( pnt ) {
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

  shrink_box (centerBox, shrinkToPercentage) {
    // centerBox is a google object from getBounds()
    // screen handling
    centerBox = JSON.stringify(centerBox)
    centerBox = JSON.parse(centerBox)

    const perc = 1.0 - shrinkToPercentage
    const dy = (centerBox.north - centerBox.south) * perc
    const dx = (Math.abs(centerBox.west) - Math.abs(centerBox.east)) * perc
    // adjust size of drain filter
    centerBox.west = centerBox.west + (dx / 2.0)
    centerBox.east = centerBox.east - (dx / 2.0)
    centerBox.north = centerBox.north - (dy / 2.0)
    centerBox.south = centerBox.south + (dy / 2.0)
    return centerBox
  }

  right_size_box (newBox, oldBox) {
    // screen handling
    // stop box from getting too big and crippling the app
    // different zoom levels will cause downloads to be too large
    let shrinkToPercentage = this.getting('shrink_to')
    let rightBox = this.shrink_box(newBox, shrinkToPercentage)

    // shrink until area is ok
    const dy = (rightBox.north - rightBox.south)
    const dx = (Math.abs(rightBox.west) - Math.abs(rightBox.east))
    const box_area = dy * dx

    while (box_area > this.getting('max_center_box_area')) {
      shrinkToPercentage -= 0.1
      if (shrinkToPercentage <= 0.1) {
        this.feedback('Are you kidding me?! No more, no more!')
        break
      }
      rightBox = this.shrink_box(newBox, shrinkToPercentage)

    }
    if (shrinkToPercentage <= 0.1) {
      return oldBox // zoomed out too far
    }
    return rightBox
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
      /*
      image = new this.component.google.maps.MarkerImage(
        'https://raw.githubusercontent.com/Wilfongjt/adopt-a-drain/master/aad-web/assets/drains/available-drain.svg',
        size,
        origin,
        anchor);
      */
    }
    /*
    image = new this.component.google.maps.MarkerImage(
      '~assets/orphan.svg',
      size,
      origin,
      anchor);
      */
    return image
  }
  marker( form ) {
    // Objective: Hide the details of creating a marker
    return new this.component.google.maps.Marker(form)
  }
  /*
  addMarker (drain) {

    //  Objective: show the drains on the map
    //  Strategy: only show newly downloaded drains

    const image = this.markerImage(drain)
    //setTimeout(function() {
      const marker = new this.component.google.maps.Marker({
        animation: this.component.google.maps.Animation.DROP,
        id: this.getting('markers').length + 1,
        position: drain.position,
        draggable: false,
        clickable: true,
        icon: image
      })
      this.getting('markers').push(marker)
    //}, drain.i * 100 )
  }
  */
}

export { MapHelper }
