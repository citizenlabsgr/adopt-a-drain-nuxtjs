import { ResponseRest } from '@/components/mixins/ResponseRest.js';

class ResponseTOU extends ResponseRest {
  // consistant interface with AAD API Web Services
  // dont be tempted to put process code here. put in calling component

  constructor (component) {
    super(component,'TOU');
  }

  ///////////////
  // Response
  /////////

  postHandler () {
    //
    // return the status

    let status = this.getStatus()// this.response.data.status;

    return status;
  }
  // ResponseAdoptees
  getHandler () {
    // existing user
    // /adopter/owner/id
    let status = this.getStatus(this.response);// gthis.response.data.status;

    return status;
  }
  // ResponseAdoptees
  putHandler () {
    // existing user
    let status = this.getStatus(this.response);// this.response.data.status;
    // this.put(response);

    return status;
  }
  // ResponseAdoptees
  deleteHandler () {
    // aadURL    string
    // aadHeader object
    // aadBody   object
    let status = this.getStatus(this.response); // this.response.data.status;

    return status;
  }

}

export { ResponseTOU }
