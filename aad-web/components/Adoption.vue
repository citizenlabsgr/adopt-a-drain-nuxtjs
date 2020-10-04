<template>
  <div>
    <br/>
    <hr/>
    <GmapMap
      ref="mapRef"
      :center="settings.options.center"
      :map-type-id="settings.options.map_type_id"
      :zoom="settings.options.zoom"
      style="height: 550px"
      @dragend="doDragEnd()"
    >
    </GmapMap>
    <hr/>
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
import Expiration from './mixins/ExpirationMixin.js'

import { gmapApi } from '~/node_modules/vue2-google-maps/src/main'
// mixins
import { GLHandlers } from './mixins/GLHandlers.js'
import { AADHandlers } from './mixins/AADHandlers.js'
import { DWHandlers } from './mixins/DWHandlers.js'
import { MapHelper } from './mixins/MapHelper.js'
import { InfoHelper } from './mixins/InfoHelper.js'
import { TokenHelper } from './mixins/TokenHelper.js'
import { Drain } from './mixins/Drain.js'
import { DrainDict } from './mixins/DrainDict.js'
import { DrainTypes } from './mixins/DrainTypes.js'


import { Utils } from './mixins/Utils.js'

export default {
  mixins: [Expiration],
  data () {
    return {
      page: {
        feedback: 'Welcome'
      },
      // the signin state of the adopter
      // hold the expiration interval instance
      drain_dict: new DrainDict(),
      //interval_monitor_expiration: null,
      location:null,
      gettingLocation: false,
      errorStr:null,
      info_window:null,
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
  watch: {
    adopter_token: function () {
      // Objective: Give the user feedback that their signin has expired
      // Strategy: monitor the state of adoptee's token,
      // * if no token then token is either expired or never initiatied
      // * if no token then the red symbols are set to grey

      if (this.adopter_token === '') {
        this.reset_symbol()
      }
    }
  },
  computed: {
    google: gmapApi,/*
    expired () {
      return this.$store.state.expires_at < new Date().getTime()/1000
    },
    isAuthenticated () {
      if( this.adopter_token && !this.expired) {
        return true
      }
      return false
    },
    */
    aad_headers() {
      // Guest Restful header
      return {
        'Authorization': 'Bearer %s'.replace('%s', process.env.AAD_API_TOKEN),
        'Content-Type': 'application/json',
        'Content-Profile': 'aad_version_1_5_0',
        'Prefer': 'params=single-object'
      }
    },
    aad_headers_authorized() {
      // current users header
      return {
        'Authorization': 'Bearer %s'.replace('%s', this.adopter_token),
        'Content-Type': 'application/json',
        'Content-Profile': 'aad_version_1_5_0',
        'Prefer': 'params=single-object'
      }
    },
    adopter_token_helper () {
      // Objective: Give user feedback about signin status
      // Stratgey: use the adopter name stashed in adopter token
      // Strategy: use the adopter's identity key to color code drain symbols
      return new TokenHelper(this.adopter_token)

      //return new TokenHelper(this.$store.state.token)
    },

    adopter_token () {
      // need for watch
      return this.$store.state.token
    },
    drain_types () {
      return new DrainTypes()
    },
    dwHandlers () {
      // Objective: Separate UI and data
      // Strategy: use class to encapsulate restful call to data.world
      return new DWHandlers(this)
    },
    dwGuestHeader () {
      // Objective: Separate UI and data
      // Strategy: use open restful call to data.world
      return {
        'Content-Type': 'application/json'
      }
    },
    dwBody () {
      // Objective: Separate UI and data
      // Strategy: use a bounding box as a view port to minimize
      return this.settings.center_box
    },
    dwURL () {
      // Objective: Separate UI and data
      // Strategy: use a developer configured url to data.world
      return process.env.DW_DRAIN_URL
    },
    mapHelper () {
      // MapHelper is a wrapper around this component
      return new MapHelper( this )
    },
    utils () {
      return new Utils()
    }
  }, // end computed
  beforeDestroy () {
    // Objective: Give the user feedback when signin expires
    // Strategy: Use a polling function
    // task: avoid memory leak while polling signin expiration

    clearInterval(this.interval_monitor_expiration)
    this.log('beforeDestroy')

  },
  created () {
    // Objective: Give the user feedback when signin expires
    // Strategy: Use a polling function
    // Task: start the polling function

    this.pollExpiration()
    this.log('created')

  },
  mounted () {
      /*
      Objective: Initialize a map of drains
      Strategy: Use vuejs's mounted to initialize
      * at this point, google is loaded but initalization may not be complete
      * center the map if and when the browser supports, safari wont center in dev mode use chrome to see centering
      * initalize the google map infowindow
      * load the drains
      */
      new GLHandlers(this).locateMe()
      .then((response) => {
        this.$refs.mapRef.$mapPromise
          .then((map) => {
            /////////////////
            // center the map on user location when browser supports
            ////////////
            if (this.location) {
              let pos = {
                lat: this.location.coords.latitude,
                lng: this.location.coords.longitude
              }
              map.setCenter(pos)
            }
            // never delete this infowindow
            this.info_window = new google.maps.InfoWindow()
            // force a global, that, for later reference
            const that = this
            // set up a listener and wait for the DOM to load
            // infoHelper attaches forms for the infowindow
            google.maps.event.addListener(this.info_window, 'domready', function () {
              let button
              let markerId
              let inputValue
              const infoHelper = new InfoHelper(that).setup_buttons()
            });
            /////////////
            // load markers
            /////////////
            this.loadDrains()
          })
          .catch((response) => {
            this.log('Unexpected issue getting map!')
          })
      })
      .catch((response) => {
        this.log('Unexpected issue locating you!')
      })
    },
  methods: {
    /*
    set_markers () {

      for(let drain in this.settings.drains) {
        // turn off when outside the box
        if (this.settings.drains[drain].type != this.drain_types.orphan) {
          let image = this.mapHelper.markerImage(this.drain_types.adoptee)
          this.settings.drains[drain].marker.setIcon(image);
        }
      }

    },
    */
    reset_symbol () {
      // Objective: Give the user log when signin expires
      // Strategy: set red symbols to grey

      for(let drain in this.drain_dict.getData()) {
        // turn off when outside the box
        if (this.drain_dict.get(drain).getType() != this.drain_types.orphan) {
          let image = this.mapHelper.markerImage(this.drain_types.adoptee)
          this.drain_dict.get(drain).getMarker().setIcon(image);
        }
      }
    },
    /*
    pollExpiration () {
      // Objective: Give the user feedback on map when signin expires
      // Strategy: use setInterval to continously check token expiration
      // * if expired then
      // *    sign the user out by setting expired_at = 0 and token = ''
  		this.interval_monitor_expiration = setInterval(() => {
  			this.$store.dispatch(
          'attempt_expiration'
        )
  		}, 3000)
	  },
    */
    /*
    isAuthenticated () {
      // Objective: Detrmine adopter's login state
      // Strategy: Use a fixed time in the future to mark when token expires
      if ( this.$store.state.adopter.expires_at < new Date().getTime() ) {
        this.$store.commit('detoken')
      }
      return this.$store.state.adopter.authenticated
    },
    */
    adopt_a_drain (drainObj) {
      /*
      Objective: Save adoption
      Strategy: Use restful API to insert adoption record
      Tasks: make copy, save, and then update symbols on success
      */
      const mapHelper = this.mapHelper
      //if (! this.adopter_token_helper.isAuthenticated()) {
      if (! this.isAuthenticated) {

        return;
      }
      const _dict = this.drain_dict
      const _data = drainObj.getData()
      const _id = drainObj.getId()
      const _headers = this.aad_headers_authorized
      const _name = drainObj.getName()
      // store an adoptee not yours
      _data['type'] = this.drain_types.adoptee
      new AADHandlers(this).aadAdoptee(process.env.AAD_API_URL+'/adoptee', _headers, _data)
        .then((response) => {
          // set local drain name
          // mark as yours
          let image = mapHelper.markerImage(this.drain_types.yours)
          _dict.get(_id)
            .setType(this.drain_types.yours)
            .setName(_name)
            .getMarker().setIcon(image)
        })
        .catch((response) => {
          //this.feedback('Unexpected issue with adoption!')
          /* eslint-disable no-console */
          console.log('Unexpected issue with adoption!')
          /* eslint-enable no-console */
        }) // end of AADHandler
    },

    log (msg) {
      /* eslint-disable no-console */
      console.log(msg)
      /* eslint-enable no-console */
    },

    //feedback (msg) {
    //  this.page.feedback = msg
    //},

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

    setInfoWindow(marker, drainObj) {
      // marker is
      const mapHelper = this.mapHelper
      const info_window = this.info_window
      // preparing adoption infowindow
      let form
      form = mapHelper.infoHelper().form(drainObj, )

      /*
      let form

      if (drainObj.getType() === this.drain_types.orphan) {

        form = mapHelper.infoHelper().form_adopt(drainObj)

      } else if (drainObj.getType() === this.drain_types.adoptee) { // DELETE
        // DELETE
        // check adopter key and drain key
        if (drainObj.getKey() && this.adopter_key === drainObj.getKey() ) {
          form =mapHelper.infoHelper().form_orphan(drainObj)
        } else {
          form = mapHelper.infoHelper().form_info(drainObj)
        }
      } else {
        form =mapHelper.infoHelper().form_orphan(drainObj)
      }
      */
      // Remember: info_window isnt defined until this event is fired,
      //           define in mounted()
      drainObj.setMarkerListener(google.maps.event.addListener(marker, "click", function() {
          info_window.close()
          info_window.setContent(form)
          info_window.open(mapHelper.map, marker)
      }));

    },
    // Removes the markers from the map, but keeps them in the array.

    visualizeMarkers(centerBox) {

      //  Objective: minimize the number of drains in the application at one time
      //  Strategy: disable and remove markers not found in the centerBox

      for(let drain_id in this.drain_dict.getData()) {
        // turn off when outside the box
        if (
          centerBox.north < this.drain_dict.get(drain_id).getLat() ||
          centerBox.south > this.drain_dict.get(drain_id).getLat() ||
          centerBox.west > this.drain_dict.get(drain_id).getLon() ||
          centerBox.east < this.drain_dict.get(drain_id).getLon()
        ) {
          // for visual effect, hide markers before deleting
          this.drain_dict.get(drain_id).hideMarker()
          // remove drain from dictionary ... this does not delete from db
          this.drain_dict.delete(drain_id)
        }
      }
    },

    /*
    orphan(drainObj) {
      const _data =
      const _headers = this.aad_headers
        // load adoptees before getting open data
        new AADHandlers(this).aadAdoptees(process.env.AAD_API_URL+'/adoptees', _headers, _data)
          .then((response) => {
            // change marker to orphan

          })
          .catch((response) => {
            this.feedback('Unexpected issue deleteing adoptee!')
          }) // end of AADHandler
    },
    */
    loadDrains () {
      /*
      Objective: Keep from downloading all the drains at one time
      Strategy:
      * Limit the number of drains to those that fall within a rectangle in middle of map screen
      ** Adoptees are stored in
      ** All Drains are stored in data.world table

      */
      //////////
      // common to both Handlers
      ////////////
      const mapHelper = this.mapHelper
      const infoHelper= new InfoHelper(this)
      // mounted() sets the center use geolocation if possible
      // prepare seach boundary for query
      const center = mapHelper.map.get('center')
      let cBox = mapHelper.map.getBounds()
      if (!cBox) { // patch up center_box
        cBox = mapHelper.boxify( center )
      }
      mapHelper.setViewBox(cBox)
      const centerBox = mapHelper.getViewBox()
      ///////////////////
      // download Adoptees
      ///////////////////
      const _data = centerBox
      const _headers = this.aad_headers
        // load adoptees before getting open data
        new AADHandlers(this).aadAdoptees(process.env.AAD_API_URL+'/adoptees', _headers, _data)
          .then((response) => {
            let AADHandlers_cnt = 0
            // if not in drains then add drain and marker and adopte image
            // if in drains and marker and marke.getMap() === null then marker.setMap(map)
            let dr = {}
            const mapHelper = this.mapHelper
            const map = mapHelper.map
            let counter = 0
            /////////////////
            // load adoptees
            ///////
            for (dr in response.data) {
              let drain = new Drain(response.data[dr]['adoptee'])
              let _payload = new TokenHelper(this.$store.state.token)
              if (_payload.value('key') === drain.getKey()) {
                // this one has been adopted by you
                drain.setType(this.drain_types.yours)
              }
              this.drain_dict.add(drain) // adds if not in already
              AADHandlers_cnt++
            } // for

            //////////////
            // Prepare to load orphans
            ///////
            this.visualizeMarkers(centerBox)
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
            //console.log('AADHandlers_cnt is ' + AADHandlers_cnt)
            //////////////
            // call the data.world service once adoptees are loaded
            /////////
            new DWHandlers(this).dwDrains(process.env.DW_DRAIN_URL, headers, data)
              .then((response) => {

                const map = mapHelper.map
                let counter = 0
                let dr = {}

                ///////////////
                // load orphans, marker, and set infowindow
                ////////
                for (dr of response.data) {

                  const dr_sync_id = dr['dr_sync_id']
                  let _drain = this.drain_dict.get(dr_sync_id)
                  // turn on or add to drains
                  // turn on markers where map is null
                  if (! _drain) {
                    // add to drains
                    const dr_lat = dr['dr_lat']
                    const dr_lon = dr['dr_lon']
                    _drain = new Drain({
                      type: this.drain_types.orphan ,
                      lat: dr_lat,
                      lon: dr_lon,
                      drain_id: dr_sync_id,
                      name: 'name me'
                    })
                    this.drain_dict.add(_drain)
                  } // else end
                  const drain = _drain
                  const image = mapHelper.markerImage(drain.getType())

                  if( drain.getMarker() === null ){
                      // make marker
                    setTimeout(function () {
                       const dropAnimation = mapHelper.dropAnimation
                       const point = {lat:drain.getLat(), lng:drain.getLon() }
                       const marker = mapHelper.marker({
                         animation: dropAnimation,
                         icon: image,
                         map:map,
                         position: point
                       })
                       drain.setMarker(marker)
                      mapHelper.component.setInfoWindow(marker, drain )
                      //mapHelper.visualize()
                     }, counter * this.settings.delay )
                  }

                  counter++

                } // end for
                if (counter === 0) {
                  /* eslint-disable no-console */
                  console.log('Nothing to show here!')
                  /* eslint-enable no-console */
                } else {
                  /* eslint-disable no-console */
                  console.log('Showing %d more Drains!'.replace('%d', counter))
                  /* eslint-enable no-console */
                }
                //console.log('DWHandlers is '  + counter)
              })
              .catch((response) => {
                /* eslint-disable no-console */
                console.log('Unexpected issue loading drains!')
                /* eslint-enable no-console */
              }) // end of DWHandlers
          })
          .catch((response) => {
            /* eslint-disable no-console */
            console.log('Unexpected issue with adoptees!')
            /* eslint-enable no-console */
          }) // end of AADHandler
    } // end loadDrains
  }
}

</script>

<style scoped>

</style>
