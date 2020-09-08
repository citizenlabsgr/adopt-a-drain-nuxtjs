
class GLHandlers {
  /*
  * dont be tempted to put process code here. put in calling component
  */
  constructor (component) {
    // component is the nuxt component
    this.component = component
    this.location = null
  }
  log(msg) {
    this.component.log(msg)
  }
  async getLocation () {
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
  }
  async locateMe() {
    // this.gettingLocation = true;
    this.component.gettingLocation = true;
    try {
      this.component.gettingLocation = false;
      this.component.location = await this.getLocation();
    } catch(e) {
      this.component.gettingLocation = false;
      this.component.errorStr = e.message;
      this.log("Error: " + e.message)
    }
  }
}

export { GLHandlers }
