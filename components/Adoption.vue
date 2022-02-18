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
import Expiration from  '@/components/mixins/expiration/ExpirationMixin.js'
import AdptMixin from '@/components/mixins/AdopteeMixin.js'
// classes
import { DWHandlers } from '@/components/mixins/DWHandlers.js'

import { InfoHelper } from '@/components/mixins/map/InfoHelper.js'
import { MapHelper } from '@/components/mixins/MapHelper.js'
import { Utils } from '@/components/mixins/Utils.js'
import GoogleMapMixin from '@/components/mixins/map/GoogleMapMixin.js'
import GraphMixin from '@/components/mixins/graph/GraphMixin.js'
import LocationMixin from '@/components/mixins/location/LocationMixin.js'
import AdopteeMixin from '@/components/mixins/adoptee/AdopteeMixin.js'

import DatumDictionaryMixin from '@/components/mixins/datum/DatumDictionaryMixin.js'
import { YoursDatum } from '@/components/mixins/datum/DatumYours.js'

import { AdopteeDatum } from '@/components/mixins/datum/DatumAdoptee.js'
import { OrphanDatum } from '@/components/mixins/datum/DatumOrphan.js'

import DrainMixin from '@/components/mixins/drain/DrainMixin.js'

/* istanbul ignore next */
export default {
  name: 'adoption',
  mixins: [Expiration,GraphMixin,GoogleMapMixin,LocationMixin,AdopteeMixin,DatumDictionaryMixin,DrainMixin],

  data () {
    return {

      name: 'Adoption',
      keyy: 0,
      page: {
        feedback: 'Welcome'
      },
      // the signin state of the adopter
      // hold the expiration interval instance
      //interval_monitor_expiration: null,
      location:null,
      gettingLocation: false,
      errorStr:null,

    }
  },
  watch: {
    current_token: function () {
      // Objective: Give the user feedback that their signin has expired
      // Strategy: monitor the state of adopter's token,
      // * if no token then token is either expired or never initiatied
      // * if no token then the red symbols are set to grey
      // console.log('current_token changed');
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
      this.updateKey();
      // this.addGlyph(` [ Adoption.vue ] `);
      this.addMount(this.name);
      /*
      this.addStart(`${this.name}.vue`);
      this.addSpace();
      this.addGlyph(` [ Init Adoption ] .`,   `. [ Mount ] `);
      this.addSpace();
      */
      this.locationGetRequest() // REQUEST
        .then((response) => {

          this.locationGetHandler(response); // HANDLER

          this.googleMapGetRequest() // REQUEST
            .then((responseMap) => {
              this.setMap(responseMap);
              this.googleMapGetHandler(responseMap, this.location); // HANDLER
              this.info_window.close(); // close open infowindow

              this.loadData()
              // ADOPTEES

            }) // Map
            .catch((err) => {
              console.error('Unexpected issue getting map! ', err);
            })
        }) // location
        .catch((err) => {
          console.error('Unexpected issue locating you! ', err);
        })
    },

  methods: {
    updateKey() {
      this.keyy++;
    },

    onAdopt(datumId) {
       if (this.graph) {
        this.addStart('Add Adpotee');
        this.addGlyph(this.down, ' (owner, datumId) ');
        this.addSpace();
      }
      if (!this.datumDictionary) {
          throw new Error('datumDictionary not found');
      }
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
      let datum = this.getDatum(datumId);
      datum.merge(form);

      this.adopteePost(owner, datum.data)
          .then((response) => {

            this.adopteePostHandler(response);
            this.addEnd();
            this.showGraph();
          })
          .catch((err) => {
            this.addError(err);
            this.showGraph();
          });

      this.info_window.close();

      this.$nuxt.$emit('refresh-my-adoptees-list');
    },
    onSave(datumId) {
      if (this.graph) {
        this.addStart('Update Adpotee');
        this.addGlyph(this.down, ' (token, owner, id, form) ');
        this.addSpace();
      }

      if (!this.datumDictionary) {
          throw new Error('datumDictionary not found');
      }
      const infoHelper = new InfoHelper(this.isAuthenticated);
      const flds = infoHelper.editable.split(',');
      const owner = this.payload.key;
      let form = {};
      for (let fld in flds) {
          form[flds[fld]]= document.getElementById(flds[fld] +'input').value;
      }
      // Get input value
      // make copy with the marker
      let datum = this.getDatum(datumId);
      datum.merge(form);
      // adopter keys
      this.adopteePutRequest(owner,datumId,datum.data)
        .then((response) => {

          this.adopteePutHandler(response);
          this.addEnd();
          this.showGraph();
        })
        .catch((err) => {
          console.log('onSave err ', err);
          this.addError(err);
          this.showGraph();
        } );

      this.info_window.close();
      this.$nuxt.$emit('refresh-my-adoptees-list');
    },

    onOrphan(datumId) {
      if (this.graph) {
          this.addStart('Orphan aka Delete');
          this.addGlyph(this.down, ' (owner, datumId) ');
          this.addSpace();
      }

      if (!this.datumDictionary) {
          throw new Error('datumDictionary not found');
      }
      const owner = this.payload.key;
      let drainObj = this.getDatum(datumId);

      this.adopteeDelete(owner, datumId)
          .then((response) => {
            this.adopteeDeleteHandler(response);

            this.addEnd();
            this.showGraph();
          })
          .catch((err) => {
            this.addGlyph(` [ ${err} ]`);
            this.showGraph();
          });
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

                    that.onAdopt(drainId);
                    // onAdopt;
                };
                break;
            case 'adoptUpdateButton':
                //[Add adopt update button handler]
                button.onclick = function () {

                  that.onSave(drainId);
                  // onSave;
                }
                break;

            case 'orphanButton':
                  // [Add orphan delete button handler]

                  button.onclick = function () {

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

     this.loadData();

    },

   loadData () {
      // Objective: Keep from downloading all the drains at one time
      // Strategy:
      // * Limit the number of drains to those that fall within a rectangle in middle of map screen

      const mbr = this.getMbr();
      this.cleanDatumCache(mbr);

      this.adopteeGetMBR(mbr)    // ADOPTEE
        .then((response) => {

          this.adopteeGetMBRHandler(response,mbr);
          // DRAINS

          this.drainGetRequest(mbr) // DRAIN
            .then((response) => {

              this.drainGetHandler(response);

              this.showSymbols();

              this.addEnd();
              this.showGraph();
              if (this.datumDictionary) {
                this.setFeedback(`Drains ${this.datumCount()}`);
              }
            })
            .catch((err) => {
              this.addError(err);
              this.showGraph();
            });

        })
        .catch((err) => {
          this.addError(err);
          this.showGraph();
        });

    }, // end loadData

    toggleMarkers() {
        if (this.graph) {
          this.addGlyph(this.down, ' [ Toggle Markers ] ');
          this.addSpace();
        }

        for (let i in this.getDictionary()) {

            // let datum = this.getDataAdpt()[i];
            let datum = this.getDictionary()[i];

            let id = datum.getId();
            let data = datum.getDataCopy();
            let owner = datum.getKey();

            if (this.isAuthenticated) {

                let isYours = (this.payload.key === datum.getKey());
                if (datum.toggleState() === 2 && isYours){
                    // upgrade marker to RED and change info window
                    this.addDatum(new YoursDatum(id, data, owner, this));
                } else if (datum.toggleState() === 2) {
                    // keep gray marker, update info window
                    this.addDatum(new AdopteeDatum(id, data, owner, this));

                } else if (datum.toggleState() === 1) {
                    // keep blue marker, change info window
                    this.addDatum(new OrphanDatum(id, data, this));

                } else {
                    console.log('toggleMarkers Unknown', datum);
                }
            } else {
                switch(datum.toggleState()) {
                    case 1:
                        this.addDatum(new OrphanDatum(id, data, this));
                        break;
                    case 2:
                        this.addDatum(new AdopteeDatum(id, data, owner, this));
                        break;
                    case 3:
                        this.addDatum(new AdopteeDatum(id, data, owner, this));
                        break;
                }

            }
        }
    },
    showSymbols() {
        try {

            if (this.graph) {
              this.addGlyph(' [ Display ] .',' [ Refresh Map ] ');
              this.addSpace();
            }


            let counter = 0;

            if (this.datumDictionary) {

              for (let i in this.getDictionary()) {

                  let datum = this.getDictionary()[i];
                  datum.show(this.map, this);
                  counter ++;

              } // for
            }

            // console.log('showSymbols 3');

            if (this.graph) {
              this.addGlyph(this.down,  this.down, ` [ Processed ${counter} Symbols ] `);
              this.addSpace();
              this.addEnd();
            }

        } catch(err) {
          console.error('showSymbols ', err);
        }
    },
  }
}
</script>

<style scoped>

</style>
