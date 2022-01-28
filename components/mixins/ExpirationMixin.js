import atob from 'atob';

export default {
  data () {
    return {
      interval_monitor_expiration: null
    };
  },
  methods: {
    setCurrentToken(token, graph=false) {
      if (graph) {
        graph.addGlyph('    | ','    | ');
        graph.addGlyph(' [ Authorize ] .','. [ Set Current Token State ] ');
        graph.addGlyph('    | ','    | ');
      }
      /* console.log(`
             (token)
                |
             [setCurrentToken]
                |
      `); */
      try {
        this.$store.commit('token', token);
      } catch(err) {
        console.error('setCurrentToken ', err);
      }
    },
    pollExpiration () {
      // Objective: Give the user feedback on map when signin expires
      // Strategy: use setInterval to continously check token expiration
      this.interval_monitor_expiration = setInterval(() => {
        this.$store.dispatch(
          'attempt_expiration'
        );
      }, 3000);
    },
    detoken () {
        this.$store.commit('detoken')
      }
  },
  computed: {
    current_token () {
      return  this.$store.state.token;
    },
    payload () {
      try {
        if (!this.current_token || this.adopter === '') {
          return JSON.parse(atob(process.env.AAD_API_TOKEN.split('.')[1]));
        }
        return JSON.parse(atob(this.current_token.split('.')[1]));
      } catch (err) {
        throw new Error('Bad Payload');
      }
    },
    displayname () {
      try {
        return this.payload.user;
      } catch(err) {
        throw new Error('Bad user', err);
      }
    },
    key () {

      try {
        return this.payload.key;
      } catch(err) {
        throw new Error('Bad key', err);
      }
    },
    scope () {

      try {
        return this.payload.scope;
      } catch(err) {
        throw new Error('Bad scope', err);
      }
    },
    sub () {
      try {
        return this.payload.sub;
      } catch(err) {
        throw new Error('Bad sub', err);
      }
    },
    exp () {
      try {
        if (!this.payload.exp) {
          return 0;
        }
        return this.payload.exp;
      } catch(err) {
        throw new Error('Bad exp', err);
      }
    },
    isAuthenticated () {
     try {
      return ( this.current_token && this.exp > 0) ;
     } catch (err) {
      throw new Error('isAuthenticated: Bad current_token or exp', err);
     }
    },
    username () {
      try {
        return this.payload.user
      } catch(err) {
        throw new Error('Bad user', err);
      }
    }
  }

}
