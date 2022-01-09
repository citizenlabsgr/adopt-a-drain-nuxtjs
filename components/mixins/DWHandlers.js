
class DWHandlers {
  /*
  consistant interface with Data.World Web Services
  * dont be tempted to put process code here. put in calling component
  */
  constructor (component) {
    // component is the nuxt component
    this.component = component
  }
  async dwSignIn (dwURL, dwHeader, dwBody) {
    const response = await this.component.$axios({
      url: dwURL,
      method: 'post',
      headers: dwHeader,
      data: dwBody })
    return response
  }

  async dwDrains (dwURL, dwHeader, dwBody) {
    const response = await this.component.$axios({
      url: dwURL,
      method: 'post',
      headers: dwHeader,
      data: dwBody })
    return response
  }

  async dwCommunityList (dwURL, dwHeader, dwBody) {
    const response = await this.component.$axios({
      url: dwURL,
      method: 'post',
      headers: dwHeader,
      data: dwBody })
    return response
  }
}

export { DWHandlers }
