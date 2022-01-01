var atob = require('atob');

export const state = () => ({
  token: false,
  payload: {user:'guest', exp: 0, key: false}
})
/*
You can think of them as computed properties for stores. Like computed properties, a getter's result is cached based on its dependencies, and will only re-evaluate when some of its dependencies have changed.
https://vuex.vuejs.org/guide/getters.html
*/

/*
The only way to actually change state in a Vuex store is by committing a mutation.
Cannot call mutation handlers directly.
how to call mutations
store.commit('token', token_str)
store.commit('detoken')
*/
export const mutations = {

  token(state, tokenText) {
    state.token = tokenText
    state.payload = JSON.parse(atob(tokenText.split('.')[1]));
    // state.payload.exp = state.payload.exp - 1775
    
  },
  detoken(state) {
    state.token = false
    state.payload = JSON.parse(JSON.stringify({user:'guest', exp: 0, key: false}))
    console.log('            [detokened]')
  }
}
/*
Actions are similar to mutations, the differences being that:
* Instead of mutating the state, actions commit mutations.
* Actions can contain arbitrary asynchronous operations.
*/
export const actions = {

  attempt_expiration(state) {
    if(state.state.payload.exp > 0) {
      if (0 > (state.state.payload.exp - (new Date().getTime()/1000)) ) {
        state.commit('detoken');
      }
    }
  }
}
