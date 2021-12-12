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
import APIHandler from '@/components/mixins/APIHandler.js'

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
import { Utils } from '@/components/mixins/Utils.js'
/* istanbul ignore next */ 
export default {
  mixins: [Expiration,APIHandler],
  data () {
    return {
      page: {
        feedback: 'Welcome'
      },
      // the signin state of the adopter
      // hold the expiration interval instance
      // drain_dict: new DrainDict(),
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
    current_token: function () {
      // Objective: Give the user feedback that their signin has expired
      // Strategy: monitor the state of adopter's token,
      // * if no token then token is either expired or never initiatied
      // * if no token then the red symbols are set to grey
      
      if (!this.isAuthenticated) {
        // if this.current_token changes reset the symbols
        this.reset_symbol()
      }
    }
  },
  computed: {
    google: gmapApi,

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

            // const current_token_helper = this.current_token_helper
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
            console.error('Unexpected issue getting map!')
          })
      })
      .catch((response) => {
        console.error('Unexpected issue locating you!')
      })

    },
  methods: {
    setFeedback(msg) {
      this.page.feedback = msg;
    },
    form_init_handler() {
      // Objective: Adopt, and orphan drains
      // Strategy: overwrite a single info_window
      //           called when user clicks on map drain symbol
      //           initializes the buttons in current info window
      //           make a state specific form
      //           make buttons on the fly
      //           apply functions to buttons
      let button_names = ['orphanButton','adoptButton','adoptUpdateButton']

      const infoHelper = new InfoHelper(this.isAuthenticated);

      const owner = this.payload.key;
      for (let i in button_names) {
        let button_name = button_names[i]
        
        if (document.getElementById(button_name)) {
          let button = document.getElementById(button_name)
          let form = {};
          button.focus()
          let drainId = button.getAttribute('data-id')
          const that = this;
          const flds = infoHelper.editable.split(',');

          switch (button.id){
            case 'adoptUpdateButton':
                //[Add adopt update button handler]
                button.onclick = function () {
                  // click on form in info window
                  // create a form for the info window
                  for (let fld in flds) {
                      form[flds[fld]]= document.getElementById(flds[fld] +'input').value;
                  }
                  // Get input value
                  // make copy with the marker
                  let drainObj = that.getDatum(drainId);

                  drainObj.merge(form);

                  // adopter keys
                  that.upsert(that.current_token, owner, drainId, drainObj);

                  that.info_window.close();
                }
                break;
            case 'adoptButton':
                // [Add adopt button handler]
                button.onclick = function () {
                    // click on form in info window
                    // create a form for the info window
                    for (let fld in flds) {
                       form[flds[fld]]= document.getElementById(flds[fld] +'input').value;
                    }
                    // Get input value
                    // make copy with the marker
                 
                    let drainObj = that.getDatum(drainId);
                    drainObj.merge(form);

                    that.upsert(that.current_token, owner, '0', drainObj);
                    
                    that.info_window.close();
                };
                break;
            case 'orphanButton':
                  // [Add orphan delete button handler]

                  button.onclick = function () {

                    let drainObj = that.getDatum(drainId);
                    that.remove(that.current_token,owner, drainObj.id);
                    that.info_window.close();
                  }

                  break;
            default:
              button.onclick = function () {
                  // Call deleteMarker function
                  console.error('stub, not implemented...yet');
              };
          }
        }
      }
    },

    reset_symbol () {
      // Objective: Give the user log when signin expires
      // Strategy: set red symbols to grey
      
      let infoHelper = new InfoHelper(this.isAuthenticated);
      const map = this.mapHelper.map
      for(let i in this.getData()) {
        // turn off when outside the box
        let drain = this.getData()[i];
        this.info_window.close();
        switch(drain.getType()) {
          case DrainTypes.adoptee: 
            // adoptee stuff here
            break;
          case DrainTypes.yours:
              drain.setType(DrainTypes.adoptee);
            break;    
          default:
            // orphan stuff here
        }
        let image = this.mapHelper.markerImage(drain.getType());
        const point = {lat:drain.getLat(), lng:drain.getLon() };
        const marker = this.mapHelper.marker({
            icon: image,
            map:map,
            position: point
        });
        let form = infoHelper.form(drain);  
        drain.setMarker(marker);
        drain.setMarkerListener(this.info_window, form); 
        drain.setIcon(image);
      }
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

    weedMarkers(centerBox) {
      //  Objective: minimize the number of drains in the application at one time
      //  Strategy: disable and remove markers not found in the centerBox
      this.info_window.close();
      let drain ;
      for(let i in this.getData()) {
        drain = this.getData()[i];

        // turn off when outside the box
        if (
          centerBox.north < drain.getLat() ||
          centerBox.south > drain.getLat() ||
          centerBox.west > drain.getLon() ||
          centerBox.east < drain.getLon()
        ) {

          // for visual effect, hide markers before deleting
          drain.hideMarker()

          // remove drain from dictionary ... this does not delete from db
          delete this.getData()[drain.id]

        }
      }

    },
    
   loadDrains () {
      // Objective: Keep from downloading all the drains at one time
      // Strategy:
      // * Limit the number of drains to those that fall within a rectangle in middle of map screen
      // ** Adoptees are stored in application DB
      // ** All Drains are stored in data.world table
      // put adoptees in cache 
      
      //////////
      // common to both Handlers
      ////////////
      const is_auth = this.isAuthenticated;
      const mapHelper = this.mapHelper

      const infoHelper= new InfoHelper(is_auth);

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
      // const _data = centerBox
      // const _data = JSON.parse(JSON.stringify(centerBox));
      const aadData = JSON.parse(JSON.stringify(centerBox));
      const aadUrl = `${process.env.AAD_API_URL}/adoptee/mbr`;

      const aadHeader = {
        "Accept":"application/json",
        'Authorization': `Bearer ${process.env.AAD_API_TOKEN}`,
        'Content-Type': 'application/json'
      };

      // load adoptees before getting open data

        new AADHandlers(this).aadAdopteeGetMBR(
          aadUrl, 
          aadHeader, 
          aadData)
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
            for (dr in response.data.selection) {

              let drain = new Drain(response.data.selection[dr].form.drain_id,
                                    response.data.selection[dr].form)
                                .setKey(response.data.selection[dr].owner);
  
              if (this.payload.key && drain) {
                
                if (this.payload.key === drain.getKey()) {
                  // this one has been adopted by you
                  drain.setType(DrainTypes.yours)
                }
              } 
              this.setDatum(drain);

              AADHandlers_cnt++
            } // for

            //////////////
            // Prepare to load orphans
            ///////
            this.weedMarkers(centerBox)
            // prepare data.world query string

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
            // [Merge adoptees and drains]
            new DWHandlers(this).dwDrains(process.env.DW_DRAIN_URL, 
                                          headers, 
                                          data)
              .then((response) => {
                const map = mapHelper.map
                const tokenHelper = this.current_token_helper
                let counter = 0
                let dr = {}
                ///////////////
                // load orphans, marker, and set infowindow
                ////////
                for (let i in response.data) {
                  let dr = response.data[i];
                  let dr_asset_id = dr['dr_asset_id']
                  // is drain already downloaded
                  let _drain = this.getDatum(dr_asset_id);
                  // turn on or add to drains
                  // turn on markers where map is null
                  if (! _drain) {
                    // add to drains
                    const dr_lat = dr['dr_lat']
                    const dr_lon = dr['dr_lon']
                    _drain = new Drain(dr_asset_id,{
                      type: DrainTypes.orphan ,
                      lat: dr_lat,
                      lon: dr_lon,
                      drain_id: dr_asset_id,
                      name: 'name me'
                    })
                    this.setDatum(_drain);
                  } // else end

                  const drain = _drain
                  const image = mapHelper.markerImage(drain.getType())
                  // const current_token_helper = this.current_token_helper
                  const info_window = this.info_window
                  
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
                       // get the form
                       let form = new InfoHelper(is_auth).form(drain);

                       // load the form to display
                       // attach a marker and info window and start listener

                       drain.setMarker(marker)
                       drain.setMarkerListener(info_window, form)

                     }, counter * this.settings.delay )
                  }

                  counter++

                } // end for
                if (counter === 0) {
                  /* eslint-disable no-console  */
                  this.setFeedback('Nothing to show here!');
                  /* eslint-enable no-console  */
                } else {
                  /* eslint-disable no-console  */
                  this.setFeedback('Showing %d more Drains!'.replace('%d', counter))
                  /* eslint-enable no-console  */
                }
              })
              .catch((err) => {
                /* eslint-disable no-console  */
                console.error('Unexpected issue loading drains!', err);
                /* eslint-enable no-console  */
              }) // end of DWHandlers
          })
          .catch((err) => {
            /* eslint-disable no-console  */
            console.error('Unexpected issue with adoptees!', err);
            /* eslint-enable no-console */
          }) // end of AADHandler

    } // end loadDrains
  }
}

</script>

<style scoped>

</style>
