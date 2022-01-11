<template>
  <div>
    <br/>
    <hr/>
      
    <!-- GoogleMap -->
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

    <!-- open dialog -->
   
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


import { gmapApi } from '@/node_modules/vue2-google-maps/src/main'
// mixins
import Expiration from '@/components/mixins/ExpirationMixin.js'
import AdptHandler from '@/components/mixins/AdptHandler.js'

// import SignIn from '@/components/SignIn'
// classes
import { DWHandlers } from '@/components/mixins/DWHandlers.js'
import { GLHandlers } from '@/components/mixins/GLHandlers.js'
import { InfoHelper } from '@/components/mixins/InfoHelper.js'
import { MapHelper } from '@/components/mixins/MapHelper.js'
import { Utils } from '@/components/mixins/Utils.js'
import GoogleMapMixin from '@/components/mixins/GoogleMapMixin.js'
/* istanbul ignore next */ 
export default {
  name: 'adoption',
  mixins: [Expiration,AdptHandler,GoogleMapMixin],
  // components: {
  //  SignIn
  // },
  data () {
    return {
      // isSignInVisible: false,
      // isModalVisible1: false,
      // whichModal: 0,
      page: {
        feedback: 'Welcome'
      },
      // the signin state of the adopter
      // hold the expiration interval instance
      //interval_monitor_expiration: null,
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
  watch: {
    current_token: function () {
      // Objective: Give the user feedback that their signin has expired
      // Strategy: monitor the state of adopter's token,
      // * if no token then token is either expired or never initiatied
      // * if no token then the red symbols are set to grey
      
      this.toggleMarkers();
      this.showSymbols();
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
  /*
    created() {
    // adds the event listener function that will handle the event
    this.$nuxt.$on('userLoggedIn', () => {
      console.log('User logged in!')
      // do something...
      this.loggedIn = true
    })
  }
  beforeDestroy() {
    // removes event listener
    this.$nuxt.$off('userLoggedIn')
  },
   */
  beforeDestroy () {
    // Objective: Give the user feedback when signin expires
    // Strategy: Use a polling function
    // task: avoid memory leak while polling signin expiration
    clearInterval(this.interval_monitor_expiration);
    // removes event listener
    this.$nuxt.$off('click-go-point');
  },
  created () {
    // Objective: Give the user feedback when signin expires
    // Strategy: Use a polling function
    // Task: start the polling function
    this.pollExpiration();
    
    // adds the event listener function that will handle the event
    this.$nuxt.$on('click-go-point', (lon, lat) => {
      this.panTo(lon, lat);
      this.loadData();
    });
    // this.$nuxt.$on('refresh-my-adoptees-list', (lon, lat) => {
    //  console.log('Adoption refresh-my-adoptees-list');
    // });
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
      console.log(`
        (*)
         |
      [mounted Adoption]
         |
      [Location Request]  
         .
         .
         .
      `);
      new GLHandlers(this).locateMe()
      .then((response) => {
        console.log(`
         .
         .
         .
      (location response)
         |  
      (location)
         |
      [Map Request] 
         .
         .
         .
      `);
        this.$refs.mapRef.$mapPromise
          .then((map) => {
            console.log(`  
         .
         .
         .
      (map response)
         |
      [Center the Map at (location)]
         |
      [setup map click handlers] <--- [google.maps.event.addListener]  
         | 
      [loadData]  
          \\
           \\
            \\
             `);
            /////////////////
            // center the map on user location when browser supports
            ////////////
            if (this.location) {
              let pos = {
                lat: this.location.coords.latitude,
                lng: this.location.coords.longitude
              }
              map.setCenter(pos);
            }
            // never delete this infowindow
            this.info_window = new google.maps.InfoWindow();
            // const current_token_helper = this.current_token_helper
            // const that = this;
            
            const form_init_handler = this.form_init_handler; 
            // set up a listener and wait for the DOM to load
            // infoHelper attaches forms for the infowindow
            google.maps.event.addListener(
              this.info_window,
              'domready',
              this.form_init_handler
            );
            /////////////
            // load markers
            /////////////
            this.setMap(map);
            this.loadData();
          })
          .catch((response) => {
            console.error('Unexpected issue getting map!');
          })
      })
      .catch((response) => {
        console.error('Unexpected issue locating you!');
      })
    },
  methods: {
    // onToggleAll() {
    //  this.toggle AuthorizedDatum(this.isAuthenticated);
    // },
  
    onAdopt(datumId) {
      console.log(`
      [onAdopt]
        |
      [collect name]
        |
      (form)  
        |
      [getDatumAdpt] 
        |
      (datum)
        |
      [merge]     
        |
      [upsertAdpt]
        |
      (token, owner, '0', datum)

      `);
      // this.signIn();
      // click on form in info window
      // create a form for the info window
      const infoHelper = new InfoHelper(this.isAuthenticated);
      const flds = infoHelper.editable.split(',');
      const owner = this.payload.key;
      let form = {};
      for (let fld in flds) {
          form[flds[fld]]= document.getElementById(flds[fld] +'input').value;
      }
      // Get input value
      // make copy with the marker
    
      let datum = this.getDatumAdpt(datumId);
      datum.merge(form);

      this.upsertAdpt(this.current_token, owner, '0', datum);

      this.info_window.close();

      this.$nuxt.$emit('refresh-my-adoptees-list');
    },
    onSave(datumId) {
      console.log(`
      [onSave]
        |
      [collect form data]
        |
      (form)  
        |
      [getDatumAdpt] 
        |
      (datum)
        |
      [merge]     
        |
      [upsertAdpt]
        |
      (token, owner, '0', datum)

      `);
      const infoHelper = new InfoHelper(this.isAuthenticated);
      const flds = infoHelper.editable.split(',');
      const owner = this.payload.key;
      let form = {};

      for (let fld in flds) {
          form[flds[fld]]= document.getElementById(flds[fld] +'input').value;
      }
      // Get input value
      // make copy with the marker
      let datum = this.getDatumAdpt(datumId);
      datum.merge(form);
      // adopter keys
      this.upsertAdpt(this.current_token, owner, datumId, datum);
      this.info_window.close();
      this.$nuxt.$emit('refresh-my-adoptees-list');
    },
    onOrphan(datumId) {
      console.log(`
       [onOrphan]
          |
       `);
      
      const owner = this.payload.key;
      let drainObj = this.getDatumAdpt(datumId);
      this.deleteAdpt(this.current_token, owner, drainObj.id);
      this.info_window.close();
      this.$nuxt.$emit('refresh-my-adoptees-list'); 
    },
    onSignIn() {
       console.log(`
       [onSignIn]
          |
       `);
       this.signIn();
       this.closeModal();
    },
    onSignOut() {
       console.log(`
       [onSignOut]
          |
       `);
       this.signOut();
       this.closeModal();
    },
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
        let button_name = button_names[i];
        if (document.getElementById(button_name)) {
          let button = document.getElementById(button_name)
          let form = {};
          button.focus();
          let drainId = button.getAttribute('data-id')
          const that = this;
          // const onAdopt = this.onAdopt(drainId);
          // const onSave = this.onSave(drainId);
          // const onOrphan = this.onOrphan(drainId);

          const flds = infoHelper.editable.split(',');

          switch (button.id){
            case 'adoptButton':
                // [Add adopt button handler]
                
                button.onclick = function () {
                    console.log(`
                    [adoptButton]
                          |
                       (datumId)
                          |
                    `);
                    that.onAdopt(drainId);
                    // onAdopt;
                };
                break;
            case 'adoptUpdateButton':
                //[Add adopt update button handler]
                button.onclick = function () {
                  console.log(`
                    [adoptUpdateButton]
                          |
                       (datumId)
                          |
                    `);
                  that.onSave(drainId);
                  // onSave;
                }
                break;
            
            case 'orphanButton':
                  // [Add orphan delete button handler]

                  button.onclick = function () {
                    console.log(`
                    [orphanButton]
                          |
                       (datumId)
                          |
                    `);
                    that.onOrphan(drainId);
                    // onOrphan;
                  }
                  break;
            default:
              button.onclick = function () {
                  // Call deleteMarker function
                  console.error('stub, not implemented...yet');
              };
          }
        } // if
      
      } // for
      
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
      this.loadData()

    },

   loadData () {
      // Objective: Keep from downloading all the drains at one time
      // Strategy:
      // * Limit the number of drains to those that fall within a rectangle in middle of map screen
      // ** Adoptees are stored in application DB
      // ** All Drains are stored in data.world table
      // put adoptees in cache
 
            // this.loadAdpt(centerBox);

      const is_auth = this.isAuthenticated;
      const mapHelper = this.mapHelper;

      // const infoHelper= new InfoHelper(is_auth);
      // mounted() sets the center use geolocation if possible
      // prepare seach boundary for query
      const center = mapHelper.map.get('center')

      let cBox = mapHelper.map.getBounds();

      if (!cBox) { // patch up center_box
        cBox = mapHelper.boxify( center );
      }

      this.setViewBox(cBox);

      const centerBox = this.getViewBox()

      this.loadAdpt(centerBox);

      // this.showSymbols();

    } // end loadData
  
  }
}

</script>

<style scoped>

</style>
