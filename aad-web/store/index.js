export const state = () => ({
  counter: 0
})
// this.$store.state
export const mutations = {
  increment(state) {
    state.counter++
  }
}
