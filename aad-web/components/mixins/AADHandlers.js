
class AADHandlers {
  /*
  consistant interface with AAD API Web Services
  * dont be tempted to put process code here. put in calling component
  */
  constructor (component) {
    // component is the nuxt component
    this.component = component
  }
  async aadAdopter (aadURL, aadHeader, aadBody) {
    const response = await this.component.$axios({
      url: aadURL,
      method: 'post',
      headers: aadHeader,
      data: aadBody })
    return response
  }
}

export { AADHandlers }
