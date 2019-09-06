<template>
  <div v-if="authorized">
    <GmapMap
      ref="mapRef"
      :center="settings.adopt.center"
      :map-type-id="settings.adopt.map_type_id"
      :zoom="settings.adopt.zoom"
      style="height: 550px"
      @dragend="doDragEnd()"
    >
      <GmapMarker
        v-for="(m, index) in settings.markers"
        ref="mapMarker"
        :key="index"
        :animation="m.animation"
        :position="m.position"
        :draggable="m.draggable"
        :clickable="m.clickable"
        @click="center=m.position"
      />
    </GmapMap>
    <div class="feedback">
      {{ page.feedback }} {{ page.center }}
    </div>
  </div>
</template>

<script>
/*
  DrainAdoption is an interactive map for showing and selecting drain markers.
    ref: https://www.npmjs.com/package/vue2-google-maps
    ref: https://developers.google.com/maps/documentation/javascript/examples/marker-simple
  nuxt.config.js
  the docs are wrong with regards to build externals
    ref: https://nuxtjs.org/api/configuration-build
    ref: https://github.com/xkjyeah/vue-google-maps/issues/498
  mapOptions
    ref: https://developers.google.com/maps/documentation/javascript/reference/
    ref: https://developers.google.com/maps/documentation/javascript/maxzoom
  markers:
    ref: https://developers.google.com/maps/documentation/javascript/markers
  mapclick
    ref: https://github.com/xkjyeah/vue-google-maps/wiki/vue-google-maps-FAQ
  mapdrag
    ref: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
*/
// import Banner from '@/components/Banner.vue'
import { DWHandlers } from './mixins/DWHandlers.js'
import { gmapApi } from '~/node_modules/vue2-google-maps/src/main'

// import World from '@/components/World.vue'
export default {

  data () {
    return {
      page: {
        feedback: 'Welcome'
      },
      settings: {
        adopt: {
          randy: 'X',
          title: 'Adoption',
          subtitle: 'Find a drain near you and adopt it.',
          map_type_id: 'terrain',
          center: { lat: 42.9634, lng: -85.6681 },
          zoom: 16,
          zoomMax: 10,
          zoomMin: 18,
          disableDoubleClickZoom: false,
          keyboardShortcuts: false,
          mapTypeControl: false,
          panControl: false,
          rotateControl: false,
          scaleControl: false,
          streetViewControl: true,
          zoomControl: true
        },
        dx: 0.0,
        dy: 0.0,
        max_center_box_area: 0.00015,
        center_box: {},
        drain_sync: [], // a list of drain sync_ids already downloaded
        drain_buffer: [], // a cache of drain data, defined before showing on map
        markers: [],
        shrink_to: 0.5 // shrink bounding box to shrink_to %
      }
    }
  },
  computed: {
    google: gmapApi,
    authorized () {
      // if (!this.$store.state.authenticated) { return false }
      return true
    },
    dwHandlers () {
      return new DWHandlers(this)
    },
    dwGuestHeader () {
      return {
        'Content-Type': 'application/json'
      }
    },
    dwBody () {
      return this.settings.center_box
    },
    dwURL () {
      // data world
      return process.env.DW_DRAIN_URL
    }
  },
  mounted () {
    /*
    Objective: Initialize a map of drains
    Strategy: Use vuejs's mounted to initialize
    * at this point, google is loaded but initalization may not be complete
    * get data from dataworld before component is visible
    * runs when component is loaded
    */
    this.$refs.mapRef.$mapPromise
      .then((map) => {
        // waiting for map initalization
        this.settings.adopt.randy = 'Y'
        this.settings.adopt.center = map.getCenter()
        // ----
        const center = map.getCenter()
        let centerBox = map.getBounds()

        if (!centerBox) { // patch up center_box
          centerBox = this.boxify(center)
        } else {
          const shrinkToPercentage = this.settings.shrink_to
          centerBox = this.shrink_box(centerBox, shrinkToPercentage)
        }
        // configurethe drain download with centerBox
        const queryStr = 'select * from grb_drains where (dr_lon > %w and dr_lon < %e) and (dr_lat > %s and dr_lat < %n) %d'
          .replace('%w', centerBox.west)
          .replace('%e', centerBox.east)
          .replace('%n', centerBox.north)
          .replace('%s', centerBox.south)
          .replace('%d', this.getDownloadedDrains())
        const data = { query: queryStr, includeTableSchema: false }
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer %s'.replace('%s', process.env.DW_AUTH_TOKEN)
        }
        // get drains within a box ... the center_box
        new DWHandlers(this).dwDrains(process.env.DW_DRAIN_URL, headers, data)
          .then((response) => {
            // load the drain buffer, getting ready to show drains on map
            this.settings.drain_buffer.length = 0 // clear the buffer
            let counter = 0 // keep track for user feedback

            let dr = {}
            for (dr in response.data) {
              counter++

              this.settings.drain_buffer.push({
                position: { lat: response.data[dr].dr_lat, lng: response.data[dr].dr_lon },
                sync_id: response.data[dr].dr_sync_id
              })
              // save data world id for use in later filtering
              this.settings.drain_sync.push(response.data[dr].dr_sync_id) // helps to prevent downloading drain more than once
            }
            if (counter === 0) {
              this.feedback('No drains to see here!')
            } else {
              this.feedback('%d drains loaded!'.replace('%d', counter))
            }
            this.showDrains()
          })
          .catch((response) => {
            this.feedback('Unexpected issue getting drains!')
          })
      })
      .catch((response) => {
        this.feedback('Unexpected issue getting map!')
      })
  },
  methods: {
    log (msg) {
      /* eslint-disable no-console */
      console.log(msg)
      /* eslint-enable no-console */
    },
    feedback (msg) {
      this.page.feedback = msg
    },
    boundary_box () {
      return JSON.stringify(this.$refs.mapRef.$mapObject.getBounds())
    },
    loadDims () {
      this.settings.center_box = JSON.stringify(this.$refs.mapRef.$mapObject.getBounds())
    },
    boxify (center) {
      // center is google center object
      // center = JSON.parse(JSON.stringify(center))
      const dx = 0.006319284439086914
      const dy = 0.0021590927669254967
      const centerBox = {
        west: center.lng() - (dx / 2.0),
        east: center.lng() + (dx / 2.0),
        north: center.lat() + (dy / 2.0),
        south: center.lat() - (dy / 2.0)
      }
      return centerBox
    },
    box_area (centerBoxJSON) {
      //
      // calculate an area for the boxify
      // centerBox is a google object from getBounds()
      const dy = (centerBoxJSON.north - centerBoxJSON.south)
      const dx = (Math.abs(centerBoxJSON.west) - Math.abs(centerBoxJSON.east))
      return dy * dx
    },
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
    },
    right_size_box (newBox, oldBox) {
      // different zoom levels will cause downloads to be too large
      let shrinkToPercentage = this.settings.shrink_to
      let rightBox = this.shrink_box(newBox, shrinkToPercentage)
      // shrink until area is ok
      while (this.box_area(rightBox) > this.settings.max_center_box_area) {
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
    },
    doDragEnd () {
      /*
      Objective:
      * Pan around on the map while downloadind drains
      * Avoid downloading all drains at one time. Gives the illusion of a fast UI
      Strategy: Use a boundary rectangle as a filter for download of drains
      * at end of scroll recalculate the bounding box
      */

      // get new center
      this.settings.adopt.center = this.$refs.mapRef.$mapObject.getCenter()
      const center = this.settings.adopt.center
      let newBox = this.$refs.mapRef.$mapObject.getBounds()

      if (!newBox) {
        // patch up center_box... map is lagging
        newBox = this.boxify(center)
      } else {
        // stop box from getting too big and crippling the app
        newBox = this.right_size_box(newBox, this.settings.center_box)
      }
      this.settings.center_box = newBox
      this.loadDrains()
      this.showDrains()
    },
    showDrains () {
      /*
        Objective: show the drains on the map
        Strategy: only show newly downloaded drains
      */
      let dr = {}
      // add just the new drains
      for (dr in this.settings.drain_buffer) {
        const marker = new this.google.maps.Marker({
          id: this.settings.markers.length + 1,
          position: this.settings.drain_buffer[dr].position,
          draggable: false,
          clickable: true,
          animation: this.google.maps.Animation.DROP
        })
        this.settings.markers.push(marker)
      }
      this.settings.drain_buffer.length = 0 // clear the buffer
    },
    loadDrains () {
      /*
      Objective: Keep from downloading all the drains at one time
      Strategy:
      * Limit the number of drains with a rectangle in middle of map screen
      * only download when panning
      * avoid downloading drain more than once
      * no need to cache, caching is done in markers
      */
      const queryStr = 'select * from grb_drains where (dr_lon > %w and dr_lon < %e) and (dr_lat > %s and dr_lat < %n) %d'
        .replace('%w', this.settings.center_box.west)
        .replace('%e', this.settings.center_box.east)
        .replace('%n', this.settings.center_box.north)
        .replace('%s', this.settings.center_box.south)
        .replace('%d', this.getDownloadedDrains())

      const data = { query: queryStr, includeTableSchema: false }
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer %s'.replace('%s', process.env.DW_AUTH_TOKEN)
      }
      this.settings.drain_buffer.length = 0 // clear the buffer
      new DWHandlers(this).dwDrains(process.env.DW_DRAIN_URL, headers, data)
        .then((response) => {
          let dr = {}
          let counter = 0

          for (dr in response.data) {
            counter++
            this.settings.drain_buffer.push({
              position: { lat: response.data[dr].dr_lat, lng: response.data[dr].dr_lon },
              syncId: response.data[dr].dr_sync_id
            })
            this.settings.drain_sync.push(response.data[dr].dr_sync_id) // helps to prevent downloading drain more than once
          }

          this.showDrains()

          if (counter === 0) {
            this.feedback('Nothing to show here!')
          } else {
            this.feedback('Showing %d more Drains!'.replace('%d', counter))
          }
        })
        .catch((response) => {
          this.feedback('Unexpected issue loading drains!')
        })
    },
    getDownloadedDrains () {
      /*
       Objective: avoid downloading drains more than once
       Strategy: make a where clause to filter out already loaded dwDrains
      */
      let lst = ''
      let i = 0
      for (i in this.settings.drain_sync) {
        if (lst.length > 0) {
          lst += ', '
        }
        lst += '"' + this.settings.drain_sync[i] + '"'
      }
      if (lst.length === 0) {
        return ' '
      }
      return 'and dr_sync_id NOT IN (%d)'.replace('%d', lst)
    }
  }
}
</script>
