<template>
  <div v-if="authorized">
    <GmapMap
      ref="mapRef"
      :center="settings.options.center"
      :map-type-id="settings.options.map_type_id"
      :zoom="settings.options.zoom"
      style="height: 550px"
      @dragend="doDragEnd()"
    >

    </GmapMap>
    <div> {{ adopterKey }} </div>
    <div class="feedback">
      {{ page.feedback }} {{ page.center }}
    </div>

  </div>
  <!-- show markers manually -->
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
import { AADHandlers } from './mixins/AADHandlers.js'
import { DWHandlers } from './mixins/DWHandlers.js'
import { gmapApi } from '~/node_modules/vue2-google-maps/src/main'
import { MapHelper } from './mixins/MapHelper.js'
// import { TableHelper } from './mixins/TableHelper.js'
// import {ServerTable, ClientTable, Event} from 'vue-tables-2';
// import World from '@/components/World.vue'
export default {

  data () {
    return {
      page: {
        feedback: 'Welcome'
      },
      drain_info: [],
      settings: {
        delay: 30,
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
        max_center_box_area: 0.00005,
        center_box: {},
        //drain_sync: [], // a list of drain sync_ids already downloaded
        drain_buffer: [], // a cache of drain data, defined before showing on map
        markers: [],
        adoptees: []
      }
    }
  },
  computed: {
    google: gmapApi,
    adopterKey() {
     // JWT's are two base64-encoded JSON objects and a trailing signature
     // joined by periods. The middle section is the data payload.
     if (this.adopter_token) return JSON.parse(atob(this.adopter_token.split('.')[1])).key;
     return undefined;
    },
    adopter_token () {
      return this.$store.state.adopter.token
    },
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
          this.loadDrains()
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
      }
      this.mapHelper.settings('center_box', newBox)
      this.loadDrains()
    },

    // Removes the markers from the map, but keeps them in the array.
    clearMarkers(centerBox) {
      /*
        Objective: minimize the number of drains in the application at one time
        Strategy: disable markers not found in the centerBox
      */
      for (let mark in this.settings.markers) {

        if (
          centerBox.north < this.settings.markers[mark].position.lat() ||
          centerBox.south > this.settings.markers[mark].position.lat() ||
          centerBox.west > this.settings.markers[mark].position.lng() ||
          centerBox.east < this.settings.markers[mark].position.lng()
        ) {
          this.settings.markers[mark].setMap(null);
        }
      }
    },
    deleteMarkers (centerBox) {
      /*
        Objective: minimize the number of drains in the application at one time
        Strategy: remove markers falling outside a box
      */
      this.clearMarkers(centerBox)
      let tmp = []
      // copy markers found in the box, skip those with map == null
      for (let mark in this.settings.markers) {
        if (this.settings.markers[mark].getMap() !== null){
          tmp.push(this.settings.markers[mark])
        }
      }
      // delete all markers in marker list
      this.settings.markers = []
      // put markers in box back into marker list load
      for (let mark in tmp) {
        this.settings.markers.push(tmp[mark])
      }
    },

    loadDrains () {
      /*
      Objective: Keep from downloading all the drains at one time
      Strategy:
      * Limit the number of drains with a rectangle in middle of map screen
      * only download initialization and when panning
      * cache adoptees
      * check drains agaist adoptee list, when found change symbol
      */
      //////////
      // common to both Handlers
      ////////////
      const mapHelper = this.mapHelper
      // prepare seach boundary for query
      const center = mapHelper.map.get('center')
      let cBox = mapHelper.map.getBounds()
      if (!cBox) { // patch up center_box
        cBox = mapHelper.boxify( center )
      }

      const centerBox = mapHelper.viewBox(cBox)
      ///////////////////

      // download Adoptees
      const _data = centerBox

      const _headers = {
        'Authorization': 'Bearer %s'.replace('%s', process.env.AAD_API_TOKEN),
        'Content-Type': 'application/json',
        'Content-Profile': 'aad_version_1_4_0',
        'Prefer': 'params=single-object'
      }

      new AADHandlers(this).aadAdoptees(process.env.AAD_API_URL+'/adoptees', _headers, _data)
        .then((response) => {

          let dr = {}
          // make adoptee list, use for later symbolism
          this.settings.adoptees={}
          for (dr in response.data) {
            this.settings.adoptees[response.data[dr]['adoptee']['drain_id']]=response.data[dr]['adoptee']
          }

          //////////////
          // Prepare to load orphans
          ///////

          this.deleteMarkers(centerBox)
          // prepare data.world query string
          const queryStr = 'select * from grb_drains where (dr_lon > %w and dr_lon < %e) and (dr_lat > %s and dr_lat < %n)'
            .replace('%w', centerBox.west)
            .replace('%e', centerBox.east)
            .replace('%n', centerBox.north)
            .replace('%s', centerBox.south)

          // pull data.world parameters together
          const data = { query: queryStr, includeTableSchema: false }
          const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer %s'.replace('%s', process.env.DW_AUTH_TOKEN)
          }

          this.settings.drain_buffer.length = 0 // clear the buffer
          const aadHandlers = new AADHandlers(this)
          //////////////
          // call the data.world service once adoptees are loaded
          /////////
          new DWHandlers(this).dwDrains(process.env.DW_DRAIN_URL, headers, data)
            .then((response) => {
              const map = mapHelper.map
              let counter = 0
              let dr = {}
              // Load data.world data
              for (dr in response.data) {
                let res_dr = response.data[dr]

                counter++
                // assume all drains are orphans
                let tdr = {
                  type: 'orphan',
                  position: { lat: res_dr.dr_lat, lng: res_dr.dr_lon },
                  syncId: res_dr.dr_sync_id
                }

                // is adoptee
                if (this.settings.adoptees[tdr['syncId']]) {

                  tdr['type']='adoptee'
                  tdr['name']=this.settings.adoptees[tdr['syncId']].name
                  // is current adopter's drain
                  if (this.adopterKey && this.settings.adoptees[tdr['syncId']].adopter_key) { // confirm someone is signed in
                    if (this.adopterKey === this.settings.adoptees[tdr['syncId']].adopter_key) {
                      tdr['type']='your_adoptee'
                      tdr['adopter_key']=this.adopterKey
                    }
                  }
                }
                // identify my adoption
                this.settings.drain_buffer.push(tdr)
                // save data world id for use in later filtering
                const image = mapHelper.markerImage(tdr)
                // rain down markers
                setTimeout(function () {
                  const dropAnimation = mapHelper.dropAnimation
                  const point = tdr.position
                  const marker = mapHelper.marker({
                    animation: dropAnimation,
                    icon: image,
                    map:map,
                    position: point
                  })
                  mapHelper.getting('markers').push(marker)
                }, counter * this.settings.delay )

              }

              if (counter === 0) {
                this.feedback('Nothing to show here!')
              } else {
                this.feedback('Showing %d more Drains!'.replace('%d', counter))
              }
            })
            .catch((response) => {
              this.feedback('Unexpected issue loading drains!')
            }) // end of DWHandlers

        })
        .catch((response) => {
          this.feedback('Unexpected issue with adoptees!')
        }) // end of AADHandler
    }
  }
}

</script>

<style scoped>

</style>
