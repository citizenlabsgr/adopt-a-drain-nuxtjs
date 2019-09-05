<template>
  <div v-if="authorized">
    <GmapMap
      ref="mapRef"
      :center="adopt.center"
      :map-type-id="adopt.map_type_id"
      :zoom="adopt.zoom"
      style="height: 550px"
      @dragend="doDragEnd()"
    >
      <GmapMarker
        v-for="(m, index) in adopt.markers"
        ref="mapMarker"
        :key="index"
        :animation="m.animation"
        :position="m.position"
        :draggable="m.draggable"
        :clickable="m.clickable"
        @click="center=m.position"
      />
    </GmapMap>
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
import { gmapApi } from '~/node_modules/vue2-google-maps/src/main'

// import World from '@/components/World.vue'
export default {

  data () {
    return {
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
        zoomControl: true,

        markers: [],
        // map.getBounds() doesn't inialize in time to load this...had to hand code it
        center_box: { 'south': 42.95463738503886, 'west': -85.69627392349241, 'north': 42.971910162437084, 'east': -85.63666451034544 },
        dx: 0.0,
        dy: 0.0
      }
    }
  },
  computed: {

    google: gmapApi,
    authorized () {
      // if (!this.$store.state.authenticated) { return false }
      return true
    }
  },
  mounted () {
    // At this point, the child GmapMap has been mounted, but
    // its map has not been initialized.
    // Therefore we need to write mapRef.$mapPromise.then(() => ...)
    /* eslint-disable no-console */
    console.log('mounted 1')
    /* eslint-enable no-console */
    this.$refs.mapRef.$mapPromise.then((map) => {
      map.panTo({ lat: 42.9634, lng: -85.6681 })
      this.adopt.randy = 'Y'
      this.adopt.center = map.getCenter()
    })
    /* eslint-disable no-console */
    console.log('mounted 2')
    /* eslint-enable no-console */
    this.adopt.center_box = { 'south': 42.96232044414465, 'west': -85.67127841768263, 'north': 42.96447953691185, 'east': -85.66492158231733 }
    this.adopt.dy = Math.abs(this.adopt.center_box.north - this.adopt.center_box.south) / 3.0
    this.adopt.dx = Math.abs(this.adopt.center_box.west - this.adopt.center_box.east) / 3.0
    /* eslint-disable no-console */
    console.log('mounted 3')
    /* eslint-enable no-console */
    this.loadDrains()
    /* eslint-disable no-console */
    console.log('mounted out')
    /* eslint-enable no-console */
  },
  methods: {
    log (msg) {
      /* eslint-disable no-console */
      console.log(msg)
      /* eslint-enable no-console */
    },
    boundary_box () {
      return JSON.stringify(this.$refs.mapRef.$mapObject.getBounds())
    },
    loadDims () {
      this.adopt.center_box = JSON.stringify(this.$refs.mapRef.$mapObject.getBounds())
    },
    doDragEnd () {
      /*
      Objective:
      * Avoid downloading all drains at one time. Gives the illusion of a fast UI
      * Have data appear as user pans around screen
      Strategy: Use a boundary rectangle as a filter for download of drain
      */

      this.adopt.center = this.$refs.mapRef.$mapObject.getCenter()

      this.adopt.center_box.north = this.adopt.center.lat() + this.adopt.dy
      this.adopt.center_box.south = this.adopt.center.lat() - this.adopt.dy
      this.adopt.center_box.west = this.adopt.center.lng() - this.adopt.dx
      this.adopt.center_box.east = this.adopt.center.lng() + this.adopt.dx

      this.loadDrains()
    },
    /* addDrain: function (drain) {

        Objective: add marker to list without duplcation
        Strategy: check new drains against all drains in markers to prevent dups
        improvement: do query with a NOT IN [] clause, check dataworld api
      let fd = true
      let drn_i = 0
      for(drn_i in this.adopt.markers){
        if(drain.id === this.adopt.markers[drn_i].id){
           // mark drain for adding
           fd = false
        }
      }
      if(fd){
        // add drain
        this.adopt.markers.push(drain)
      }
    },
    */

    loadDrains () {
      this.log('loadDrains 1')
      /*
      Objective: Keep from downloading all the drains at one time
      Strategy:
      * Limit the number of drains with a rectangle in middle of map screen
      * only download when panning
      * cache already downloaded drains
      */
      // const resp = ''

      const queryStr = 'select * from grb_drains where (dr_lon > %w and dr_lon < %e) and (dr_lat > %s and dr_lat < %n) %d'
        .replace('%w', this.adopt.center_box.west)
        .replace('%e', this.adopt.center_box.east)
        .replace('%n', this.adopt.center_box.north)
        .replace('%s', this.adopt.center_box.south)
        .replace('%d', this.getDownloadedDrains())

      this.log('q= ' + queryStr)
      this.log('process.env.DW_DRAIN_URL: ' + process.env.DW_DRAIN_URL)
      this.$axios({
        method: 'post',
        url: process.env.DW_DRAIN_URL,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.DW_AUTH_TOKEN
        },
        data: { query: queryStr, includeTableSchema: false }
        // data: { query: "select * from grb_drains LIMIT 10", includeTableSchema: false }
      })
        .then((response) => {
          this.log('axios response 1')
          let dr = {}
          this.log('axios response 2 ' + response.data)
          for (dr in response.data) {
            const lt = response.data[dr].dr_lat
            const ln = response.data[dr].dr_lon
            const syncId = response.data[dr].dr_sync_id
            // this.log('axios response 3')
            const marker = new this.google.maps.Marker({
              id: syncId,
              position: { lat: lt, lng: ln },
              draggable: false,
              clickable: true,
              animation: this.google.maps.Animation.DROP
            })
            // this.log('axios response 4')
            this.adopt.markers.push(marker)
            // this.addDrain(marker)
            // this.addDrain({ id: sync_id, position: { lat: lt, lng: ln } })
          }
          this.log('axios response out')
        })
        .catch((response) => {
          /* eslint-disable no-console */
          console.log('error' + JSON.stringify(response))
          /* eslint-enable no-console */
        })
    },
    getDownloadedDrains () {
      this.log('getDownloadedDrains 1')
      let lst = ''
      let i = 0
      for (i in this.adopt.markers) {
        if (lst.length > 0) {
          lst += ', '
        }
        lst += '"' + this.adopt.markers[i].id + '"'
      }
      if (lst.length === 0) {
        this.log('getDownloadedDrains no markers')
        return ' '
      }
      this.log('getDownloadedDrains out')
      return 'and dr_sync_id NOT IN (%d)'.replace('%d', lst)
    }
  }
}
</script>
