
class AADHandlers {
  /*
  consistant interface with AAD API Web Services
  * dont be tempted to put process code here. put in calling component
  */
  constructor (component) {
    // component is the nuxt component
    this.component = component;
  }
  async aadAdopteePost (aadURL, aadHeader, aadBody) {

    const response = await this.component.$axios({
      url: aadURL,
      method: 'post',
      headers: aadHeader,
      data: aadBody });
    return response
  }
  

  async aadAdopteeGetMBR (aadURL, aadHeader, aadBody) {
    // aadURL    string
    // aadHeader object
    // aadBody   object

    // aadBody is MBR, {"north":<N.N>,"south":<N.N>,"west":<N.N>,"east":<N.N> }
    // aadHeader has Authorization
    // inject MBR into aadHeader

    const response = await this.component.$axios({
      url: aadURL,
      method: 'post',
      headers: aadHeader,
      data: aadBody});
    return response
  }

  async aadAdopterPost (aadURL, aadHeader, aadBody) {
    // New user
    const response = await this.component.$axios({
      url: aadURL,
      method: 'post',
      headers: aadHeader,
      data: aadBody });
    return response
  }

  async aadAdopterGet (aadURL, aadHeader) {
    // existing user
    // /adopter/owner/id

    const response = await this.component.$axios({
      url: aadURL,
      method: 'get',
      headers: aadHeader});
    return response
  }

  async aadAdopterPut (aadURL, aadHeader, aadBody) {
    // existing user

    const response = await this.component.$axios({
      url: aadURL,
      method: 'put',
      headers: aadHeader,
      data: aadBody });
    return response
  }

  async aadSignin (aadURL, aadHeader, aadBody) {
    // aadURL    string
    // aadHeader object
    // aadBody   object

    const response = await this.component.$axios({
      url: aadURL,
      method: 'post',
      headers: aadHeader,
      data: aadBody });
    return response
  }
}

export { AADHandlers }
