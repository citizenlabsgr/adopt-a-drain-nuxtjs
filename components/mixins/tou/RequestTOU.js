import { RequestRest } from '@/components/mixins/RequestRest.js';

class RequestTOU extends RequestRest {
  // consistant interface with AAD API Web Services
  // dont be tempted to put process code here. put in calling component

  constructor (component) {
    super(component,'TOU');
  }

  ///////////////
  // document
  /////////

  async Get (owner, id) {

    // existing document
    // /document/owner/id
    const url = `${process.env.AAD_API_URL}/document/${owner}/${id}`;
    const headers = this.guestHeader;

    return await this.get(url, headers);
  }
  /*
  async Post (form) { // aka SignUp

    const url = `${process.env.AAD_API_URL}/document`;
    const headers = this.userHeader;
    const data = form;
    // console.log('Post url     ', url );
    // console.log('Post headers ', headers );
    // console.log('Post form    ', form );

    // New adoptee aka user
    return await this.post(url,headers,data);

  }
  */
  /*
  async Put (owner, id, form) {
    // existing user
    // delete form['password']; // get rid of password
    const url = `${process.env.AAD_API_URL}/document/${owner}/${id}`;
    const headers = this.userHeader;
    const data = form;

    return await this.component.$axios({
      url: url,
      method: 'put',
      headers: headers,
      data: data });
  }
  */

}

export { RequestTOU }

