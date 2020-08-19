export const state = () => ({
  token: 'no-token',
  authenticated: false,
  timeout: 1,
  expires_at: new Date().getTime()
})

export const mutations = {
  token(state, tokenText) {
    state.token = tokenText
    state.expires_at =  new Date().getTime() + (state.timeout * (1000 * 60))
    state.authenticated = true
  },
  detoken(state) {
    state.token = ''
    state.expires_at = 0
    state.authenticated = false
  },
  authenticated(state, isAuth) {
    state.authenticated = isAuth
  },
  timeout(state, time_in_min) {
    state.timeout = time_in_min
  }
  /*
  expires_in(time_in_min) {
    state.expires_in = time_in_min
  },
  set_expiration() {
    state.expires_at =  new Date().getTime() + (state.expires_in * (1000 * 60))
  }
  */
}
