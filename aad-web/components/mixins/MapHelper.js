class MapHelper {
  constructor (component) {
    // component is the nuxt component
    this.component = component
  }

  set(key, value) {
    this.component.settings.adopt[key] = value
  }

  get(key) {
    return this.component.settings.adopt[key]
  }

  settings( key, value ) {
     this.component.settings[key] = value
  }

  getting( key ) {
    return this.component.settings[key]
  }

  boxify ( pnt ) {
    // generate a box from a point
    const dx = 0.006319284439086914
    const dy = 0.0021590927669254967
    const centerBox = {
      west: center.lng() - (dx / 2.0),
      east: center.lng() + (dx / 2.0),
      north: center.lat() + (dy / 2.0),
      south: center.lat() - (dy / 2.0)
    }
    return centerBox
  }

  shrink_box (centerBox, shrinkToPercentage) {
    // centerBox is a google object from getBounds()

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
    // stop box from getting too big and crippling the app
    // different zoom levels will cause downloads to be too large
    // let shrinkToPercentage = this.settings.shrink_to
    let shrinkToPercentage = this.getting('shrink_to')
    // let rightBox = this.shrink_box(newBox, shrinkToPercentage)
    let rightBox = this.shrink_box(newBox, shrinkToPercentage)

    // shrink until area is ok
    // while (this.box_area(rightBox) > this.settings.max_center_box_area) {
    const dy = (rightBox.north - rightBox.south)
    const dx = (Math.abs(rightBox.west) - Math.abs(rightBox.east))
    const box_area = dy * dx
    // while (this.box_area(rightBox) > this.mapHelper.getting('max_center_box_area')) {

    while (box_area > this.getting('max_center_box_area')) {
      shrinkToPercentage -= 0.1
      if (shrinkToPercentage <= 0.1) {
        this.feedback('Are you kidding me?! No more, no more!')
        break
      }
      // rightBox = this.shrink_box(newBox, shrinkToPercentage)
      rightBox = this.shrink_box(newBox, shrinkToPercentage)

    }
    if (shrinkToPercentage <= 0.1) {
      return oldBox // zoomed out too far
    }
    return rightBox
  }
}

export { MapHelper }
