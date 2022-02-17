import { ResponseRest } from '../ResponseRest.js';

class ResponseAdopter extends ResponseRest {
  // consistant interface with AAD API Web Services
  // dont be tempted to put process code here. put in calling component
  
  constructor (component) {
    super(component,'Adopter');
  }
  
  ///////////////
  // Adopter
  /////////
  // async aadAdopterPost (aadURL, aadHeader, aadBody) {
  
  postHandler () {
    // 
    // return the status
    
    let status = this.response.data.status;
    /*
    switch(status) {
      case '200': 
        
        break;
      case '400': 
        
        break;
      case '409': 
        
        break;
    }
    */
    return status;
  }
  
  getHandler () {
    // existing user
    // /adopter/owner/id
    let status = this.response.data.status;

    // this.get(response);

    return status;
  }

  putHandler () {
    // existing user
    let status = this.response.data.status;
    // this.put(response);

    return status;
  }
  
  signinHandler () {
    // aadURL    string
    // aadHeader object
    // aadBody   object
    let status = this.response.data.status;
    
    return status;
  }
  
}

export { ResponseAdopter }