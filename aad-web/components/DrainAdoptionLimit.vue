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
      }
      this.mapHelper.settings('center_box', newBox)
      this.loadDrains()
    },

    // Removes the markers from the map, but keeps them in the array.
    clearMarkers(centerBox) {
      // this.setMapOnAll(null);
      for (let mark in this.settings.markers) {
        // this.log('marker')
        // this.log(this.settings.markers[mark].position.lat())
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
      this.clearMarkers(centerBox)
      let tmp = []
      for (let mark in this.settings.markers) {
        if (this.settings.markers[mark].getMap() !== null){
          tmp.push(this.settings.markers[mark])
        }
      }
      this.settings.markers = []
      for (let mark in tmp) {
        this.settings.markers.push(tmp[mark])
      }
    },
    /*
    deleteAllMarkers () {
      // this.log('deleteMarkers 1')
      this.clearMarkers()
      // this.log('deleteMarkers 2')
      this.settings.markers = []
      // this.log('deleteMarkers out')
    },
    */
    loadDrains () {
      /*
      Objective: Keep from downloading all the drains at one time
      Strategy:
      * Limit the number of drains with a rectangle in middle of map screen
      * only download when panning
      * avoid downloading drain more than once
      * no need to cache, caching is done in markers
      */
      this.log('loadDrains 1')
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
      this.log('loadDrains 2')

      const centerBox = mapHelper.viewBox(cBox)
      // this.log(centerBox)
      ///////////////////

      mapHelper.log('loaddrains 9')
      // download Adoptees
      const _data = centerBox

      const _headers = {
        'Authorization': 'Bearer %s'.replace('%s', process.env.AAD_API_TOKEN),
        'Content-Type': 'application/json',
        'Content-Profile': 'aad_version_1_4_0',
        'Prefer': 'params=single-object'
      }
      mapHelper.log(_headers)
      mapHelper.log('loadDrains 11')
      mapHelper.log(process.env.AAD_API_URL+'/adoptees')

      aadHandlers.aadAdoptees(process.env.AAD_API_URL+'/adoptees', _headers, _data)
        .then((response) => {
          //const mapHelper = this.mapHelper
          mapHelper.log('loadDrains 12')
          mapHelper.log(response.data)
          let dr = {}
          // let low_point = {dr_lat: 90.01}
          for (dr in response.data) {
            mapHelper.log(response.data[dr])
          }
          //////////////
          // Prepare to load orphans
          ///////
          /*
          this.log('loadDrains 2.1')
          this.deleteMarkers(centerBox)
          this.log('loadDrains 3')
          // prepare data.world query string
          const queryStr = 'select * from grb_drains where (dr_lon > %w and dr_lon < %e) and (dr_lat > %s and dr_lat < %n)'
            .replace('%w', centerBox.west)
            .replace('%e', centerBox.east)
            .replace('%n', centerBox.north)
            .replace('%s', centerBox.south)

          this.log('loadDrains 4')

          // pull data.world parameters together
          const data = { query: queryStr, includeTableSchema: false }
          const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer %s'.replace('%s', process.env.DW_AUTH_TOKEN)
          }
          this.log('loadDrains 5')

          this.settings.drain_buffer.length = 0 // clear the buffer
          this.log('loadDrains 6')
          const aadHandlers = new AADHandlers(this)
          this.log('loadDrains 7')
          //////////////
          // call the data.world service once adoptees are loaded
          /////////
          new DWHandlers(this).dwDrains(process.env.DW_DRAIN_URL, headers, data)
            .then((response) => {
              mapHelper.log('loadDrains 8')
              const map = mapHelper.map
              //const tableHelper = this.tableHelper
              let counter = 0
              let dr = {}
              // let low_point = {dr_lat: 90.01}
              for (dr in response.data) {
                counter++
                let tdr = {
                  type: 'orphan',
                  position: { lat: response.data[dr].dr_lat, lng: response.data[dr].dr_lon },
                  syncId: response.data[dr].dr_sync_id
                }
                // this.log('loadDrains 9')
                this.settings.drain_buffer.push(tdr)
                // save data world id for use in later filtering
                // this.settings.drain_sync.push(response.data[dr].dr_sync_id) // helps to prevent downloading drain more than once
                // this.log('loadDrains 10')
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
            }) // end of DWHandlers
            */
        })
        .catch((response) => {
          this.feedback('Unexpected issue with adoptees!')
        }) // end of AADHandler


        // this.feedback('low_point')
        // this.log('loadDrains out')
        /*
        curl http://localhost:3100/rpc/adoptees -X POST \
            -H "Authorization: Bearer $ADOPTER_TOKEN" \
            -H "Content-Type: application/json" \
            -H "Content-Profile: aad_version_1_4_0" \
            -H "Prefer: params=single-object" \
            -d '{"north": 42.96465175640001,"south": 42.96065175640001,"west": -85.6736956307,"east": -85.6670956307}'
        */

    }
  }
}

</script>

<style scoped>

</style>
