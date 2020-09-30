
export const state = () => ({
  token: '',
  expires_at: 0
})
/*
You can think of them as computed properties for stores. Like computed properties, a getter's result is cached based on its dependencies, and will only re-evaluate when some of its dependencies have changed.
https://vuex.vuejs.org/guide/getters.html
*/

/*
The only way to actually change state in a Vuex store is by committing a mutation.
Cannot call mutation handlers directly.
how to call mutations
store.commit('expires_at', time_int)
store.commit('token', token_str)
store.commit('detoken')
*/
export const mutations = {
  expires_at(state, time) {
    state.expires_at = time
  },
  token(state, tokenText) {
    state.token = tokenText
  },
  detoken(state) {
    state.token = ''
    state.expires_at = 0
  }
}
/*
Actions are similar to mutations, the differences being that:
* Instead of mutating the state, actions commit mutations.
* Actions can contain arbitrary asynchronous operations.
*/
export const actions = {

  attempt_expire(state) {

    if (state.state.expires_at > 0
        && (state.state.expires_at < (new Date().getTime()/1000))) {
      state.commit('detoken');
      console.log('expired token');
    }
  }
}
