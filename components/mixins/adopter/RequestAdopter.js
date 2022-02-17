import { RequestRest } from '../RequestRest.js';

class RequestAdopter extends RequestRest {
  // consistant interface with AAD API Web Services
  // dont be tempted to put process code here. put in calling component

  constructor (component) {
    super(component,'Adopter');
  }

  ///////////////
  // Adopter
  /////////

  async Get (owner, id) {
    // existing user
    // /adopter/owner/id
    const url = `${process.env.AAD_API_URL}/adopter/${owner}/${id}`;

    const headers = this.userHeader;
    return await this.get(url, headers);
    /*
    return await this.component.$axios({
      url: url,
      method: 'get',
      headers: headers});
    */
  }

  async Post (form) { // aka SignUp

    const url = `${process.env.AAD_API_URL}/signup`;
    const headers = this.guestHeader;
    const data = form;
    // console.log('Post url     ', url );
    // console.log('Post headers ', headers );
    // console.log('Post form    ', form );

    // New Adopter aka user
    return await this.post(url,headers,data);

  }

  async Put (owner, id, form) {
    // existing user
    // delete form['password']; // get rid of password
    const url = `${process.env.AAD_API_URL}/adopter/${owner}/${id}`;
    const headers = this.userHeader;
    const data = form;

    return await this.component.$axios({
      url: url,
      method: 'put',
      headers: headers,
      data: data });
  }

  /*
  use SignInMixin
  async Signin (aadURL, aadHeader, aadBody) {
    // aadURL    string
    // aadHeader object
    // aadBody   object

    return await this.component.$axios({
      url: aadURL,
      method: 'post',
      headers: aadHeader,
      data: aadBody });

  }
  */

}

export { RequestAdopter }
