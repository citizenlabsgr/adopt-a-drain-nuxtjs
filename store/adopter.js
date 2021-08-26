/*
export const state = () => ({
  token: 'no-token'
  //authenticated: false,
  //timeout: 1,
  //expires_at: new Date().getTime()
})

export const mutations = {
  token(state, tokenText) {
    state.token = tokenText
    //state.expires_at =  new Date().getTime() + (state.timeout * (1000 * 60))
    //state.authenticated = true
  },
  detoken(state) {
    state.token = ''
    //state.expires_at = 0
    //state.authenticated = false
  },
  //authenticated(state, isAuth) {
  //  state.authenticated = isAuth
  //},
  //timeout(state, time_in_min) {
  //  state.timeout = time_in_min
  //}
}

export const actions = {

  attempt_expire(state) {
    //console.log('attempt_expire')
    // return this.$store.state.adopter.expires_at < new Date().getTime()
    if (state.state.expires_at > 0
        && (state.state.expires_at < new Date().getTime())) {
      state.commit('detoken')
      console.log('expired token')
    }

  }
}
*/
