// import atob from 'atob';

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
    setToken(token) {
      // console.log('expiration setToken ')
      this.$store.commit('token', token);
    },
    pollExpiration () {
      // Objective: Give the user feedback on map when signin expires
      // Strategy: use setInterval to continously check token expiration
      this.interval_monitor_expiration = setInterval(() => {
        this.$store.dispatch(
          'attempt_expiration'
        );
      }, 3000)

    }
    // setExpiresAt (exp_time) {
    //   return this.$store.state.expires_at(exp_time)
    // }

  },
  computed: {
    adopter_token () {
      return  this.$store.state.token
    },
    payload () {

      if (!this.adopter_token) {
        // console.log(' process.env.AAD_API_TOKEN)', process.env.AAD_API_TOKEN);
        // throw Error('Payload missing token!');
        return JSON.parse(atob(process.env.AAD_API_TOKEN.split('.')[1]))
      }
      else if (this.adopter_token.split('.').length !== 3) {
        throw Error('Payload bad token')
      }
      return JSON.parse(atob(this.adopter_token.split('.')[1]))
    },
    displayname () {
        return this.payload.user 
    },
    key () {
      return this.payload.key
    },
    scope () {
      return this.payload.scope
    },
    sub () {
      return this.payload.sub
    },
    exp () {
        return this.payload.exp
    },
    expired () {

      if (this.adopter_token) {
        return this.exp < new Date().getTime()/1000
      }
      return true 
    },
    isAuthenticated () {
      if( this.adopter_token && !this.expired) {
        return true
      }
      return false
    },
    username () {
      return this.payload.user
    }
  }

}
