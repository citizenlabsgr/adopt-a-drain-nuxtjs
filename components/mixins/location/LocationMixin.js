export default {
  data () {
    return {
      name: 'LocationMixin',
      location: false
    };
  },
  methods: {
    async locationGetRequest () {
      if (this.graph) {
        this.addRequestService('GET', 'Location');
      }
      return new Promise((resolve, reject) => {

         if(!("geolocation" in navigator)) {
           reject(new Error('Geolocation is not available.'));
         }

         navigator.geolocation.getCurrentPosition(pos => {
           resolve(pos);
         }, err => {
           reject(err);
         });

       });
    },

    locationGetHandler(response) {
      if (this.graph) {
        this.addResponseService('GET', 'Location', '(lat,lon)');
        this.addPassFail('Location','not found');
      }
      this.location = response;
    }

  } // methods
}
