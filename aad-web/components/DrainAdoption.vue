<template>
  <div v-if="authorized">
    <button class="button" @click="flipMarkers ()" >
      flip
    </button>
    <GmapMap
      ref="mapRef"
      :center="settings.options.center"
      :map-type-id="settings.options.map_type_id"
      :zoom="settings.options.zoom"
      style="height: 550px"
      @dragend="doDragEnd()"
    >

    </GmapMap>
<div>hi</div>
    <div id="map"></div>
<div>xxxx</div>
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
import { MapHelper } from './mixins/MapHelper.js'
// import World from '@/components/World.vue'
export default {

  data () {
    return {
      page: {
        feedback: 'Welcome'
      },
      settings: {
        delay: 50,
        options: {
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
    },
    mapHelper () {
      // MapHelper is a wrapper around this component
      return new MapHelper( this )
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
          // this.log('mounted 1')
          this.loadDrains()
          // this.log('mounted out')
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
    doDragEnd () {
      /*
      Objective:
      * Pan around on the map while downloadind drains
      * Avoid downloading all drains at one time. Gives the illusion of a fast UI
      Strategy: Use a boundary rectangle as a filter for download of drains
      * at end of scroll recalculate the bounding box
      */

      // get new center
      this.mapHelper.set(this.$refs.mapRef.$mapObject.getCenter())
      const center = this.mapHelper.get('center')

      let newBox = this.$refs.mapRef.$mapObject.getBounds()

      if (!newBox) {
        // patch up center_box... map is lagging
        newBox = this.mapHelper.boxify(center)
      } else {
        // stop box from getting too big and crippling the app
        newBox = this.mapHelper.right_size_box(newBox, this.settings.center_box)
      }
      this.mapHelper.settings('center_box', newBox)

      this.loadDrains()
      // this.showDrains()
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
      // this.log('loadDrains 1')
      const mapHelper = this.mapHelper
      // start
      const center = mapHelper.map.get('center')
      let centerBox = mapHelper.map.getBounds()
      if (!centerBox) { // patch up center_box
        // this.log('mounted 5')
        centerBox = mapHelper.boxify( center )
      } else {
        // this.log('mounted 6')
        const shrinkToPercentage = mapHelper.getting('shrink_to')
        centerBox = mapHelper.shrink_box(centerBox, shrinkToPercentage)
      }

      const queryStr = 'select * from grb_drains where (dr_lon > %w and dr_lon < %e) and (dr_lat > %s and dr_lat < %n) %d'
        .replace('%w', centerBox.west)
        .replace('%e', centerBox.east)
        .replace('%n', centerBox.north)
        .replace('%s', centerBox.south)
        .replace('%d', this.getDownloadedDrains())

      // this.log('loadDrains 3')

      const data = { query: queryStr, includeTableSchema: false }
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer %s'.replace('%s', process.env.DW_AUTH_TOKEN)
      }
      // this.log('loadDrains 4')

      this.settings.drain_buffer.length = 0 // clear the buffer

      new DWHandlers(this).dwDrains(process.env.DW_DRAIN_URL, headers, data)
        .then((response) => {
          // mapHelper.log('loadDrains 6')
          const map = mapHelper.map
          let counter = 0
          let dr = {}

          for (dr in response.data) {
            counter++
            let tdr = {
              type: 'orphan',
              position: { lat: response.data[dr].dr_lat, lng: response.data[dr].dr_lon },
              syncId: response.data[dr].dr_sync_id
            }
            // this.log('loadDrains 8')
            this.settings.drain_buffer.push(tdr)
            // save data world id for use in later filtering
            this.settings.drain_sync.push(response.data[dr].dr_sync_id) // helps to prevent downloading drain more than once
            // this.log('loadDrains 9')
            const image = mapHelper.markerImage(tdr)
            setTimeout(function () {
            // mapHelper.log('loadDrains 10x')
              const dropAnimation = mapHelper.dropAnimation
              const point = tdr.position
              const marker = mapHelper.marker({
                animation: dropAnimation,
                icon: image,
                map:map,
                position: point
              })
              mapHelper.getting('markers').push(marker)
            }, counter * this.settings.delay)
          }

          if (counter === 0) {
            this.feedback('Nothing to show here!')
          } else {
            this.feedback('Showing %d more Drains!'.replace('%d', counter))
          }
        })
        .catch((response) => {
          this.feedback('Unexpected issue loading drains!')
        })
        // this.log('loadDrains out')
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
