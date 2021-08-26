export default {

  //data: () => ({
  //  interval_monitor_expiration: null
  //}),
  data () {
    return {
      interval_monitor_expiration: null
    }
  },
  methods: {

    pollExpiration () {
      // Objective: Give the user feedback on map when signin expires
      // Strategy: use setInterval to continously check token expiration
      this.interval_monitor_expiration = setInterval(() => {
        this.$store.dispatch(
          'attempt_expiration'
        )
      }, 3000)

    }

  },
  computed: {
    adopter_token () {
      return  this.$store.state.token
    },
    expired () {
      return this.$store.state.expires_at < new Date().getTime()/1000
    },
    isAuthenticated () {
      if( this.adopter_token && !this.expired) {
        return true
      }
      return false
    }
  }

}
