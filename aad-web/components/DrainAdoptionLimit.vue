<template>
  <div v-if="authorized">
    <!-- div v-if="errorStr">
      Sorry, but the following error
      occurred: {{errorStr}}
    </div -->

    <!-- div v-if="gettingLocation">
      <i>Getting your location...</i>
    </div -->

    <!--div v-if="location">
      Your location data is {{ location.coords.latitude }}, {{ location.coords.longitude}}
    </div -->
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
let infoWindow

import { GLHandlers } from './mixins/GLHandlers.js'
import { AADHandlers } from './mixins/AADHandlers.js'
import { DWHandlers } from './mixins/DWHandlers.js'
import { gmapApi } from '~/node_modules/vue2-google-maps/src/main'
import { MapHelper } from './mixins/MapHelper.js'



export default {

  data () {
    return {
      page: {
        feedback: 'Welcome'
      },
      location:null,
      gettingLocation: false,
      errorStr:null,
      settings: {
        drains: {},
        delay: 20,
        options: {
          randy: 'X',
          title: 'Adoption',
          subtitle: 'Find a drain near you and adopt it.',
          map_type_id: 'terrain',
          center: { lat: 42.9634, lng: -85.6681 },
          zoom: 16,
          zoomMax: 10,
          zoomMin: 20,
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
        drain_buffer: [], // a cache of drain data, defined before showing on map
        markers: [],
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
      new GLHandlers(this).locateMe()
      .then((response) => {
        this.$refs.mapRef.$mapPromise
          .then((map) => {
            // center the map on user location
            if (this.location) {
              let pos = {
                lat: this.location.coords.latitude,
                lng: this.location.coords.longitude
              }
              map.setCenter(pos)
            }
            this.loadDrains()
          })
          .catch((response) => {
            this.feedback('Unexpected issue getting map!')
          })
      })
      .catch((response) => {
        this.feedback('Unexpected issue locating you!')
      })
      /*
      this.$refs.mapRef.$mapPromise
        .then((map) => {
          this.loadDrains()
        })
        .catch((response) => {
          this.feedback('Unexpected issue getting map!')
        })
      */

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
    deepCopy(json_obj) {
      let newObj = JSON.parse(JSON.stringify(json_obj))
      return newObj
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
    addInfoWindow(marker, drainObj) {

      const mapHelper = this.mapHelper
        // preparing infowindow

      let conteudo = '<info>'
      for (let dr in drainObj) {
        //mapHelper.log(dr)

        mapHelper.log()
        if (! (drainObj[dr] instanceof Object) ) {
          conteudo += dr + ': ' + '<h4>' + drainObj[dr] + '</h4>'
          '<br/>'
        }
      }
      conteudo += '</info>';

      // adding listener, so infowindow is opened
      google.maps.event.addListener(marker, "click", function() {

          if (infoWindow)
              infoWindow.close();

          infoWindow = new google.maps.InfoWindow({
              content: conteudo
          });
          infoWindow.open(mapHelper.map, marker);
      });
    },
    // Removes the markers from the map, but keeps them in the array.

    hideMarkers(centerBox) {

      //  Objective: minimize the number of drains in the application at one time
      //  Strategy: disable markers not found in the centerBox

      for(let drain in this.settings.drains) {
        // turn off when outside the boc
        if (
          centerBox.north < this.settings.drains[drain].lat ||
          centerBox.south > this.settings.drains[drain].lat ||
          centerBox.west > this.settings.drains[drain].lon ||
          centerBox.east < this.settings.drains[drain].lon
        ) {
          this.settings.drains[drain].marker.setMap(null);
        }
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
      // mounted() sets the center use geolocation if possible
      // prepare seach boundary for query
      const center = mapHelper.map.get('center')
      let cBox = mapHelper.map.getBounds()
      if (!cBox) { // patch up center_box
        cBox = mapHelper.boxify( center )
      }
      const centerBox = mapHelper.viewBox(cBox)
      ///////////////////
      // download Adoptees
      ///////////////////
      const _data = centerBox
      const _headers = {
        'Authorization': 'Bearer %s'.replace('%s', process.env.AAD_API_TOKEN),
        'Content-Type': 'application/json',
        'Content-Profile': 'aad_version_1_4_0',
        'Prefer': 'params=single-object'
      }
        new AADHandlers(this).aadAdoptees(process.env.AAD_API_URL+'/adoptees', _headers, _data)
          .then((response) => {
            // if not in drains then add drain and marker and adopte image
            // if in drains and marker and marke.getMap() === null then marker.setMap(map)
            let dr = {}
            const mapHelper = this.mapHelper
            const map = mapHelper.map
            const drains = this.settings.drains
            mapHelper.log('AADHandlers 1')
            let counter = 0
            for (dr in response.data) {
              mapHelper.log('AADHandlers 2')

              if (this.settings.drains[response.data[dr]['adoptee']['drain_id']]) { // found
                // turn on (if off) by setting map
                if (this.settings.drains[response.data[dr]['adoptee']['drain_id']].marker.getMap() === null) { // found
                  this.settings.drains[response.data[dr]['adoptee']['drain_id']].marker.setMap(map)
                }
              } else { // not found then add
                let tdr = this.deepCopy(response.data[dr]['adoptee'])
                tdr['marker']={}
                // add by drain key
                this.settings.drains[tdr.drain_id]=tdr
                let image = mapHelper.markerImage(tdr.type)
                if (this.adopterKey === tdr.adopter_key) {
                  image = mapHelper.markerImage('your_adoptee')
                }
                /*
                infoWindow.setPosition(pos);
                            infoWindow.setContent('Location found.');
                            infoWindow.open(map);
                */
                /*
                let activeInfoWindow
                let isWindowOpen = false
                let activeThingId
                let activeMarker
                let thingIds = []

                google.maps.event.addListener(marker, 'click', function() {

                      if(activeInfoWindow) {
                        activeInfoWindow.close();
                      }
                      let infoWindow = new google.maps.InfoWindow({
                        maxWidth: 370
                      });
                      google.maps.event.addListener(infoWindow, 'closeclick', function() {
                        isWindowOpen = false;
                      });
                      activeInfoWindow = infoWindow;
                      activeThingId = tdr.drain_id;
                      activeMarker = marker;
                      $.ajax({
                        type: 'GET',
                        url: '/info_window',
                        data: {
                          'thing_id': thingId
                        },
                        success: function(data) {

                          // Prevent race condition, which could lead to multiple windows being open at the same time.
                          if(infoWindow === activeInfoWindow) {
                            infoWindow.setContent(data); // set content of info window
                            infoWindow.open(map, marker); // present info window to user
                            isWindowOpen = true;
                          }
                        }
                      });
                    });
                */
                //mapHelper.log('Marker 1')
                /////////////
                //
                ///////////
                setTimeout(function () {

                  const dropAnimation = mapHelper.dropAnimation
                  const point = {lat:tdr.lat, lng:tdr.lon }
                  const marker = mapHelper.marker({
                   animation: dropAnimation,
                   icon: image,
                   map:map,
                   position: point
                  })
                  tdr['marker'] = marker
                  // infoWindow
                  //this.addInfoWindow(marker, tdr )

                  }, counter * this.settings.delay )

              }
              counter++
              // add marker
            } // for
            mapHelper.log('AADHandlers 3')

            //////////////
            // Prepare to load orphans
            ///////
            this.hideMarkers(centerBox)
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
            //////////////
            // call the data.world service once adoptees are loaded
            /////////
            new DWHandlers(this).dwDrains(process.env.DW_DRAIN_URL, headers, data)
              .then((response) => {
                const map = mapHelper.map
                let counter = 0
                let dr = {}
                //  drains should all have markers at this point
                // if not in drains then add drain and marker and adopte image
                // if in drains and marker and not marker.map then marker.setMap(map)
                // Load data.world data
                for (dr of response.data) {
                  const dr_sync_id = dr['dr_sync_id']
                  // turn on or add to drains
                  // turn on markers where map is null
                  if (this.settings.drains[dr_sync_id]) {
                    // turn on (if off) by setting map
                    if (this.settings.drains[dr_sync_id].marker.getMap() === null){
                      this.settings.drains[dr_sync_id].marker.setMap(map)
                    }
                  } else { // add to drains
                    // add new marker
                    // assume all drains are orphans
                    const dr_lat = dr['dr_lat']
                    const dr_lon = dr['dr_lon']
                    const tdr = {
                      type: 'orphan',
                      lat: dr_lat,
                      lon: dr_lon,
                      drain_id: dr_sync_id,
                      name: 'name me'
                    }
                    // add by drain key
                    this.settings.drains[tdr.drain_id] = tdr
                    const image = mapHelper.markerImage(tdr)
                    setTimeout(function () {
                                   const dropAnimation = mapHelper.dropAnimation
                                   const point = {lat:tdr.lat, lng:tdr.lon }
                                   const marker = mapHelper.marker({
                                     animation: dropAnimation,
                                     icon: image,
                                     map:map,
                                     position: point
                                   })
                                   tdr['marker'] = marker
                                   mapHelper.component.addInfoWindow(marker, tdr )

                                 }, counter * this.settings.delay )
                  }
                  counter++
                } // end for
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

    } // end loadDrains
  }
}

</script>

<style scoped>

</style>
