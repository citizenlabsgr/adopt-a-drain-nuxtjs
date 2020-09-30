<template>
  <div class="band">
    <!-- Step 1 Sign In -->
    <!--div v-if="!adopter_token_helper.isAuthenticated()"-->
    <div v-if="!isAuthenticated">
      <h1 id="title" class="title">
        {{ page[0].title }}
      </h1>
      <h2 class="subtitle">
        {{ page[0].subtitle }}
      </h2>
      <div class="center">

        <!-- User Name -->
        <div class="prompt" ><label for="username">{{meta.username.prompt}}</label></div>
        <div>
          <input id="username" v-model="aadform.name" placeholder="email">
        </div>
        <div id="error-name" :class="[is_username ? 'input_ok' : 'input_error']">{{status_username}}</div>

        <p>&nbsp;</p>

        <!-- Password -->
        <div class="prompt"><label for="password">{{meta.password.prompt}}</label></div>
        <div>
          <input id="password" v-model="aadform.password" type="password" placeholder="password">
        </div>
        <div id="error-password" :class="[is_password ? 'input_ok' : 'input_error']">{{status_password}}</div>
        <p>&nbsp;</p>

        <!-- Sign In Button -->
        <div>
          <button id="signin" class="button" @click="onSignIn ()" :disabled="isDisabled">
            Sign In
          </button>
        </div>
      </div>
    </div>
    <!-- Step 2 Sign Out-->
    <div v-else>
      <h1 class="title">
        {{ page[1].title }}
      </h1>
      <h2 class="subtitle">
        {{ page[1].subtitle }}
      </h2>
      <button class="button" @click="onSignOut ()">
        Sign Out
      </button>
    </div>
  </div>
</template>
<script>
// TODO: add authentication (test, code, doc)
// DONE: Authenticate component tests
// DONE: Authenticate code
// DONE: add state for signin token

// import { mapMutations } from 'vuex'
import { AADHandlers } from './mixins/AADHandlers.js'
import { TokenHelper } from './mixins/TokenHelper.js'
import { Constants } from './mixins/Constants.js'

export default {
  data () {
    return {
      page: [{
        title: 'Sign In',
        subtitle: 'Because.'
      },
      {
        title: 'Sign Out',
        subtitle: 'Because.'
      }
      ],
      aadform: {
        name: '',
        password: ''
      },
      meta: {
        username :{
          prompt:"User Name",
          status:"",
          regexp: Constants.email()
        },
        password :{
          prompt:"Password",
          status:"",
          regexp: Constants.password()
        }
      },
      adopter_token: this.$store.state.token
    }
  },
  computed: {
    isAuthenticated () {
      if(this.adopter_token) {
        return true
      }
      return false
    },
    isDisabled () {
      return !(this.is_password && this.is_username)
    },
    is_username () { // true when not compliant, expects an email
      return (Constants.user_name().test(this.aadform.name.trim()))
    },
    status_username () {
      return (this.is_username ? "Ok" : "Required")
    },
    is_password () { // true when not compliant, expects an email
      return (Constants.password().test(this.aadform.password.trim()))
    },
    status_password () {
      return (this.is_password ? "Ok" : "Required")
    },
    aadHandlers () {
      return new AADHandlers(this)
    },
    aadHeader () {
      return {
        'Authorization': 'Bearer ' + process.env.AAD_API_TOKEN,
        'Content-Type': 'application/json',
        'Content-Profile': process.env.AAD_API_VERSION,
        'Prefer': 'params=single-object'
      }
    },
    aadUrl () {
      // remove just_fail in signup
      return process.env.AAD_API_URL + '/signin'
    },
    aadBody () {
      return JSON.stringify(this.aadform)
    }
  },
  methods: {
    log (msg) {
      /* eslint-disable no-console */
      console.log(msg)
      /* eslint-enable no-console */
    },
    feedBack (msg) {
      this.page.subtitle = msg
    },
    setExpiresAt(time) {
      this.$store.commit('expires_at', time)
    },
    setToken (token) {
      this.$store.commit('token', token)
    },
    detoken () {
      this.$store.commit('detoken')
    },

    onSignIn () {

      this.aadHandlers.aadSignin(this.aadUrl, this.aadHeader, this.aadBody)
        .then((response) => {
          if (response.status === 200) {
            this.feedBack('Go find a drain to adopt!')
            this.setToken(response.data.token)
            this.setExpiresAt(new TokenHelper(response.data.token).getExpiration())
          } else {
            this.feedBack('Whoa, I did not see this comming (%s)!'.replace('%s', response.status))
            this.log('Whoa, I did not see this comming (%s)!'.replace('%s', response.status))
          }
        })
        .catch((err) => {
          this.detoken()
          if (err.message.includes('403')) {
            this.feedBack('Have you signed up?')
          } else {
            this.feedBack('Something unexpected happened while searching (%s)!'.replace('%s', err))
            this.log('Something unexpected happened while searching (%s)!'.replace('%s', err))
          }
        })
    },
    onSignOut () {
      this.$store.commit('detoken')
    }
  }
}
</script>

<style scoped>
.band {
  width: 100%;
  height: 400px;
}
.center {
  /*display: flex;*/
  /*justify-content: center;*/
  /*align-items: center;*/
  /*background-color: #0000FF*/

}
.input {
   text-align:left;
}
.input_ok {
  color: #339933;
  text-align: left;
  font-variant: petite-caps;
  font-size: 12px;
}
.input_error {
  color: #990033;
  text-align: left;
  font-variant: petite-caps;
  font-size: 12px;
}
.prompt {
  text-align:left;
  font-variant: petite-caps;
}
.username {
  color: #990033;
  text-align: left;
}
.displayname {
  color: #990033;
  text-align: left;
}
</style>
