// this mixin is dependent on google
// should create and/or migrate all google methods here
import { MapHelper } from '@/components/mixins/map/MapHelper.js'
export default {
  data () {
    return {
      name: 'GoogleMapMixin',
      map: false,
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
        view_box: {}
      }
    };
  },
  computed: {
    /*
    mapHelper () {
      // MapHelper is a wrapper around this component
      return new MapHelper( this );
    },
    */
  }, // computed
  methods: {
    setMap(map){
      if (this.graph) {
        this.addGlyph(this.down,' [ Set Map ] ');
        this.addSpace();
      }
      this.map = map;
    },
    panTo(lon, lat) {
      // console.log('panTo', graph);
      if (this.graph) {
        this.addGlyph(this.down, ' [ Pan Map ] ');
      }
      let latLng = new this.google.maps.LatLng(lat, lon); //Makes a latlng
      this.getMap().panTo(latLng);
    },

    //// request
    async googleMapGetRequest(){
      if (this.graph) {
        this.addRequestService('GET', 'Map', 'location');
        // this.addSpace();
      }

      return await this.$refs.mapRef.$mapPromise;
    }, // GET
    //// response
    googleMapGetHandler(responseMap, location) {
      if (this.graph) {
        this.addResponseService('GET', 'Map', 'map');
        this.addPassFail('Map','not found');

      }
      /////////////////
      // center the map on user location when browser supports
      ////////////
      // console.log('responseMap ',responseMap);
      if (location) {
        let pos = {
          lat: location.coords.latitude,
          lng: location.coords.longitude
        }
        responseMap.setCenter(pos);
      }
      // never delete this infowindow
      this.info_window = new this.google.maps.InfoWindow();

      const form_init_handler = this.form_init_handler;
      // set up a listener and wait for the DOM to load
      // info Helper attaches forms for the infowindow
      if (this.graph) {
        this.addGlyph(this.down,     ' [ Setup map click listeners ] ');
        this.addSpace();
      }
      // [ Set Map Listener ]
      google.maps.event.addListener(
        this.info_window,
        'domready',
        this.form_init_handler
      );
      /////////////
      // load markers
      /////////////
      this.setMap(responseMap);

      const mapHelper = new MapHelper( this );
      // mounted() sets the center use geolocation if possible
      // prepare seach boundary for query
      // graph.addSpace();
      this.addGlyph(this.down, ' [ Get Map Center ] ');
      this.addSpace();

      // [ Get User Location ]
      const center = mapHelper.map.get('center');

      if (this.graph) {
        this.addGlyph(this.down, `  (lat, lgn) `);
        this.addSpace();
      }

      let cBox = mapHelper.map.getBounds();

      if (!cBox) { // patch up center_box
        cBox = this.boxify( center );
      }
      this.setViewBox(cBox);

    }, // googleMapGetHandler

    boxify ( pnt ) {
      // Objective: keep data download from getting too big
      // Strategy: create screen center box when no google map obj is available
      // screen handling
      // generate a box from a point
      const dx = 0.006319284439086914
      const dy = 0.0021590927669254967
      const centerBox = {
        west: pnt.lng() - (dx / 2.0),
        east: pnt.lng() + (dx / 2.0),
        north: pnt.lat() + (dy / 2.0),
        south: pnt.lat() - (dy / 2.0)
      }
      return centerBox
    }, // boxify

    markerImage ( type ) {
      if (!this.google) {

      }
      // Objective: visually differentiate Orphan, Adoptee, and your Adoptee
      const size = new this.google.maps.Size(27.0, 38.0);
      const origin = new this.google.maps.Point(0, 0);
      const anchor = new this.google.maps.Point(13.0, 18.0);

      let image = undefined

      if (type === DrainTypes.adoptee ) {
        image = new this.google.maps.MarkerImage(
          '/adoptee.svg',
          size,
          origin,
          anchor);
      } else if (type === DrainTypes.yours) {

        image = new this.google.maps.MarkerImage(
          '/your-adoptee.svg',
          size,
          origin,
          anchor);
      } else {

        image = new this.google.maps.MarkerImage(
          '/orphan.svg',
          size,
          origin,
          anchor);
      }

      return image
    }, // markerImage

    getBounds() {
      // return this.map.getBounds()
      return this.$refs.mapRef.$mapObject.getBounds();
    },
    getCenter() {
      // return this.map.getBounds()
      return this.$refs.mapRef.$mapObject.getCenter();
    },
    getViewBox() {
      return this.view_box;
    },

    setViewBox ( box ) {
      // Objective: keep data download from getting too big
      // Strategy: expand or shrink box until a maximum area is just found
      // assume box is too big ... so make smaller first
      box = JSON.stringify(box)

      box = JSON.parse(box)

      const bumpSize = 0.01 // growth ratio
      const dy = box.north - box.south
      const dx = (Math.abs(box.west) - Math.abs(box.east))
      let area_ = dy * dx
      let bumpY = dy * bumpSize
      let bumpX = dx * bumpSize

      // make smaller
      while (area_ > this.getMaxArea()) {
        box.north -= bumpY
        box.south += bumpY
        box.west += bumpX
        box.east -= bumpX
        area_ = (box.north - box.south) * (Math.abs(box.west) - Math.abs(box.east))
      }

      // make just a little bigger
      while (area_ < this.getMaxArea()) {
        box.north += bumpY
        box.south -= bumpY
        box.west -= bumpX
        box.east += bumpX
        area_ = (box.north - box.south) * (Math.abs(box.west) - Math.abs(box.east))
      }
      this.view_box = box;
      return this;
    },
    marker( form ) {
      // Objective: Hide the details of creating a marker
      return new google.maps.Marker(form)
    },
    getMaxArea(){
      return this.settings.max_center_box_area
    }
  } // Methods
}
