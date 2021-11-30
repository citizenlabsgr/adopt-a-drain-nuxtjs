
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
store.commit('expires _at', time_int)
store.commit('token', token_str)
store.commit('detoken')
*/
export const mutations = {
  token(state, tokenText) {
    state.token = tokenText;
    let expires_at = JSON.parse(atob(tokenText.split('.')[1]));
    if (expires_at.exp) {
      state.expires_at = expires_at.exp;
    }
  },
  detoken(state) {
    state.token = '';
    state.expires_at = 0;
    console.log('detokened');
  }
}
/*
Actions are similar to mutations, the differences being that:
* Instead of mutating the state, actions commit mutations.
* Actions can contain arbitrary asynchronous operations.
*/
export const actions = {
  attempt_expiration(state) {

    if(state.state.expires_at > 0) {
      //console.log('attempt_expiration ' + state.state.expires_at)
      
      if (state.state.expires_at < (new Date().getTime()/1000)) {

        state.commit('detoken');
        console.log('expired token');
      }
    }
  }
}
