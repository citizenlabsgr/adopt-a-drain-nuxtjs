// this mixin is dependent on google
// should create and/or migrate all google methods here
export default {
  data () {
    return {
      name: 'GoogleMapMixin'
    };
  },
  methods: {
    panTo(lon, lat) {
      let latLng = new google.maps.LatLng(lat, lon); //Makes a latlng
      this.getMap().panTo(latLng); 
    },
  }
}
