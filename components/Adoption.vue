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

import Expiration from '@/components/mixins/ExpirationMixin.js'

import { gmapApi } from '@/node_modules/vue2-google-maps/src/main'

// mixins

import { AADHandlers } from '@/components/mixins/AADHandlers.js'
import { Drain } from '@/components/mixins/Drain.js'
import { DrainDict } from '@/components/mixins/DrainDict.js'
import { DrainTypes } from '@/components/mixins/DrainTypes.js'
import { DWHandlers } from '@/components/mixins/DWHandlers.js'
import { GLHandlers } from '@/components/mixins/GLHandlers.js'
import { InfoHelper } from '@/components/mixins/InfoHelper.js'
import { MapHelper } from '@/components/mixins/MapHelper.js'
import { TokenHelper } from '@/components/mixins/TokenHelper.js'
import { Utils } from '@/components/mixins/Utils.js'

/* istanbul ignore next */ 
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
    google: gmapApi,
    aad_headers() {
      // Guest Restful header
      // 'Accept', 'Authorization', 'Content-Type', 'If-None-Match', 'Content-Profile'
      // if (process.env.NODE_ENV === 'development') {
        return {
        "Accept":"application/json",
        'Authorization': `Bearer ${process.env.AAD_API_TOKEN}`,
        'Content-Type': 'application/json'
        }
      
      /* } 
      return {
        "Accept":"",
        'Access-Control-Allow-Origin':'http://localhost:3000',
        'Authorization': `Bearer ${process.env.AAD_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Profile': 'aad_version_1_5_2',
        'If-None-Match': '',
        'Prefer': 'params=single-object'
      }
      */
    },
    aad_headers_authorized() {
      // current users header
      return {
        'Authorization': 'Bearer %s'.replace('%s', this.adopter_token),
        'Content-Type': 'application/json',
        'Content-Profile': 'aad_version_1_5_2',
        'Prefer': 'params=single-object'
      }
    },
    adopter_token () {
      // need for watch
      return this.$store.state.token
    },
    adopter_token_helper () {
      // Objective: Give user feedback about signin status
      // Stratgey: use the adopter name stashed in adopter token
      // Strategy: use the adopter's identity key to color code drain symbols
      return new TokenHelper(this.adopter_token)
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
      // example: {west: -84.3, east: -84.0, north: 42.3, south: 42.0}
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
  },
  created () {
    // Objective: Give the user feedback when signin expires
    // Strategy: Use a polling function
    // Task: start the polling function
    this.pollExpiration()
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

            const adopter_token_helper = this.adopter_token_helper
            const that = this
            // set up a listener and wait for the DOM to load
            // infoHelper attaches forms for the infowindow
            google.maps.event.addListener(
              this.info_window,
              'domready',
              function () {
                that.form_init_handler()
              }
            );
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
    setFeedback(msg) {
      this.page.feedback = msg;
    },
    form_init_handler() {
      // Objective: Adopt, and orphan drains
      // Strategy: overwrite a single info_window
      //           make a state specific form
      //           make buttons on the fly
      let button_names = ['orphanButton','adoptButton','adoptUpdateButton']
      const infoHelper = new InfoHelper(this.adopter_token_helper)

      for (let i in button_names) {
        let button_name = button_names[i]
        if (document.getElementById(button_name)) {
          let button = document.getElementById(button_name)
          let form = {};
          button.focus()
          let drainId = button.getAttribute('data-id')
          const that = this;

          switch (button.id){
            case 'adoptUpdateButton':
               form['id']=drainId;
            case 'adoptButton':
                const flds = infoHelper.editable.split(',');
                button.onclick = function () {
                    // click on form in info window
                    // create a form for the info window
                    for (let fld in flds) {
                       form[flds[fld]]= document.getElementById(flds[fld] +'input').value;
                    }
                    // Get input value
                    // make copy with the marker
                    let drainObj = that.drain_dict.get(drainId);

                    drainObj.merge(form);
                    // adopter keys
                    that.adopt_a_drain(drainObj);
                    that.info_window.close();
                };
                break;
            case 'orphanButton':

                  button.onclick = function () {
                    let drainObj = that.drain_dict.get(drainId);

                    that.orphan_a_drain(drainObj);
                    that.info_window.close();
                  }

                  break;
            default:
              button.onclick = function () {
                  // Call deleteMarker function
                  console.log('stub, not implemented...yet');
              };
          }
        }
      }
    },

    reset_symbol () {
      // Objective: Give the user log when signin expires
      // Strategy: set red symbols to grey
      //
      let infoHelper = new InfoHelper(this.adopter_token_helper)

      for(let drain in this.drain_dict.getData()) {
        // turn off when outside the box
        if (this.drain_dict.get(drain).getType()
                != DrainTypes.orphan) {
          let form = infoHelper.form(this.drain_dict.get(drain))
          let image = this.mapHelper.markerImage(DrainTypes.adoptee)
          this.drain_dict
            .get(drain)
            .setIcon(image);
        }
      }
    },

    adopt_a_drain (drainObj) {
      /*
      Objective: Save adoption
      Strategy: Use restful API to insert adoption record
      Tasks: make copy, save, and then update symbols on success
      */
      const mapHelper = this.mapHelper
      if (! this.isAuthenticated) {
        return;
      }
      const _dict = this.drain_dict
      const _data = drainObj.getData()
      const _id = drainObj.getId()
      const _headers = this.aad_headers_authorized
      const _name = drainObj.getName()
      const _infoHelper = new InfoHelper(this.adopter_token_helper)
      const _infowindow = this.info_window
      const _key = this.adopter_token_helper.getKey()
      // store an adoptee not yours
      _data['type'] = DrainTypes.adoptee
      //////////
      // handle both add and update
      ///////
      new AADHandlers(this).aadAdoptee(process.env.AAD_API_URL+'/adoptee', _headers, _data)
        .then((response) => {
          // returns the new or updated version
          // grab it and update the buffer
          // get your marker
          let image = mapHelper.markerImage(DrainTypes.yours)
          let drain = _dict.get(_id)

          drain.merge(response.data.data)
          drain.setType(DrainTypes.yours)
            .getMarker().setIcon(image)

          let form = _infoHelper.form(_dict.get(_id))
          drain.setMarkerListener(_infowindow, form)

        })
        .catch((response) => {
          //this.feedback('Unexpected issue with adoption!')
          /* eslint-disable no-console */
          console.log('Unexpected issue with adoption!')
          /* eslint-enable no-console */
        }) // end of AADHandler
    },
    orphan_a_drain (drainObj) {
      /*
      Objective: Orphan a drain , remove an adoption
      Strategy: Use restful API to remove adoptee record
      Tasks:
        * identify record to remove
        * remove from database
        * update local drain copy (remove id, and key, change image, )
      */
      const mapHelper = this.mapHelper
      if (! this.isAuthenticated) {
        return;
      }
      const _data = this.utils.copyDeletable(drainObj.getData())
      const _dict = this.drain_dict
      const _infowindow = this.info_window
      const _headers = this.aad_headers_authorized
      const _id = drainObj.getId()
      const _infoHelper = new InfoHelper(this.adopter_token_helper)

      new AADHandlers(this).aadAdoptee(process.env.AAD_API_URL+'/adoptee', _headers, _data)
        .then((response) => {
          // set local drain name
          // mark as yours

          let image = mapHelper.markerImage(DrainTypes.orphan)
          let drain = _dict.get(_id)
          
          // change data in buffer
          drain.setData(this.utils.copyWithout(response.data.data,["id","adopter_key"]))
               .setType(DrainTypes.orphan)
               .setIcon(image)
          drain.setMarkerListener(_infowindow,
                                  _infoHelper.form(drain))

        })
        .catch((response) => {
          //this.feedback('Unexpected issue with adoption!')
          /* eslint-disable no-console */
          console.log('Unexpected issue with deletion!')
          /* eslint-enable no-console */
        }) // end of AADHandler

    },
    log (msg) {
      /* eslint-disable no-console */
      console.log(msg)
      /* eslint-enable no-console */
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

    */
    loadDrains () {
      // console.log('loadDrains 1');
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
      // console.log('loadDrains 2');

      const mapHelper = this.mapHelper
      const infoHelper= new InfoHelper(this.adopter_token_helper)

      // mounted() sets the center use geolocation if possible
      // prepare seach boundary for query
      const center = mapHelper.map.get('center')
      // console.log('loadDrains 3');
      let cBox = mapHelper.map.getBounds()

      if (!cBox) { // patch up center_box
        cBox = mapHelper.boxify( center )
      }
      // console.log('loadDrains 4');
      mapHelper.setViewBox(cBox)

      const centerBox = mapHelper.getViewBox()

      ///////////////////
      // download Adoptees
      ///////////////////
      const _data = centerBox
      // console.log('loadDrains 5');
      const _headers = this.aad_headers

        // load adoptees before getting open data
      // console.log('loadDrains 6');
      // console.log('axios', this.$axios);
        new AADHandlers(this).aadAdoptees(process.env.AAD_API_URL+'/adoptees', _headers, _data)
          .then((response) => {
            // console.log('loadDrains 6.1');
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
            for (dr in response.data.selection) {
              let drain = new Drain(response.data[dr]['adoptee']);
              // let _payload = new TokenHelper(this.$store.state.token);
              let _payload = new TokenHelper(process.env.AAD_API_TOKEN);

              if (_payload && drain) {

                if (_payload.getKey() === drain.getKey()) {
                  console.log('loadDrains 3.1.3.3');
                  // this one has been adopted by you
                  drain.setType(DrainTypes.yours)
                }
              }
              this.drain_dict.add(drain) // adds if not in already
              AADHandlers_cnt++
            } // for

            //////////////
            // Prepare to load orphans
            ///////
            this.visualizeMarkers(centerBox)
            // prepare data.world query string
            //const queryStr = 'select * from grb_drains where (dr_lon > %w and dr_lon < %e) and (dr_lat > %s and dr_lat < %n)'

            const queryStr = 'select * from %x where (dr_lon > %w and dr_lon < %e) and (dr_lat > %s and dr_lat < %n)'
              .replace('%x', process.env.DW_TABLE)
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
            // console.log('loadDrains 7');
            new DWHandlers(this).dwDrains(process.env.DW_DRAIN_URL, headers, data)
              .then((response) => {
                // console.log('loadDrains 7.1');
                const map = mapHelper.map
                const tokenHelper = this.adopter_token_helper
                let counter = 0
                let dr = {}

                ///////////////
                // load orphans, marker, and set infowindow
                ////////
                for (dr of response.data) {

                  let dr_asset_id = dr['dr_asset_id']

                  // is drain already downloaded
                  let _drain = this.drain_dict.get(dr_asset_id)

                  // turn on or add to drains
                  // turn on markers where map is null

                  if (! _drain) {
                    // add to drains
                    const dr_lat = dr['dr_lat']
                    const dr_lon = dr['dr_lon']
                    _drain = new Drain({
                      type: DrainTypes.orphan ,
                      lat: dr_lat,
                      lon: dr_lon,
                      drain_id: dr_asset_id,
                      name: 'name me'
                    })
                    this.drain_dict.add(_drain)
                  } // else end

                  const drain = _drain
                  const image = mapHelper.markerImage(drain.getType())
                  const adopter_token_helper = this.adopter_token_helper
                  const info_window = this.info_window
                  //console.log('drain: ' + JSON.stringify(_drain.data))
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
                       //console.log('point: ' + JSON.stringify(point))
                       // get the form
                       let form = new InfoHelper(adopter_token_helper).form(drain)

                       // load the form to display
                       // attach a marker and info window and start listener

                       drain.setMarker(marker)
                       drain.setMarkerListener(info_window, form)

                     }, counter * this.settings.delay )
                  }

                  counter++

                } // end for
                if (counter === 0) {
                  /* eslint-disable no-console */
                  // console.log('Nothing to show here!');
                  this.setFeedback('Nothing to show here!');
                  /* eslint-enable no-console */
                } else {
                  /* eslint-disable no-console */
                  // console.log('Showing %d more Drains!'.replace('%d', counter))
                  this.setFeedback('Showing %d more Drains!'.replace('%d', counter))
                  /* eslint-enable no-console */
                }
              })
              .catch((err) => {
                /* eslint-disable no-console */
                console.error('Unexpected issue loading drains!', err);
                /* eslint-enable no-console */
              }) // end of DWHandlers
          })
          .catch((err) => {
            /* eslint-disable no-console */
            console.error('Unexpected issue with adoptees!');
            console.error('err', err);

            // console.error('response', response);
            /* eslint-enable no-console */
          }) // end of AADHandler

    } // end loadDrains
  }
}

</script>

<style scoped>

</style>
