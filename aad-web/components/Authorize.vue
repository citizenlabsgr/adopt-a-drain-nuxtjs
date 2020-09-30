<template>
  <div class="band">
    <h1 id="title" class="title">
      {{ page.title }}
    </h1>
    <p>
      <label class="subtitle">{{ page.subtitle }}</label>
    </p>

    <!--div v-if="!adopter_token_helper.isAuthenticated()"-->
    <div v-if="!isAuthenticated">

      <div class="center">
        <!-- Display Name -->
        <div>
          <!--div class="prompt">{{meta.displayname.prompt}}</div-->
          <div class="prompt" ><label for="displayname">{{meta.displayname.prompt}}</label></div>
          <div class="input">
            <input id="displayname"
                   v-model="aadform.displayname"
                   type="displayname"
                   placeholder="your screen name">
          </div>
          <div id="error-displayname"
               :class="[is_displayname ? 'input_ok' : 'input_error']">
               {{status_displayname}}
          </div>

        </div>
        <!-- User Name -->
        <div>
            <div class="prompt" ><label for="username">{{meta.username.prompt}}</label></div>
            <div class="input"><input id="username" v-model="aadform.name" placeholder="your email"></div>
            <div id="error-name" :class="[is_username ? 'input_ok' : 'input_error']">{{status_username}}</div>
        </div>
        <!-- Password -->
        <div>
          <div class="prompt" ><label for="password">{{meta.password.prompt}}</label></div>
          <div class="input"><input id="password" v-model="aadform.password" type="password" placeholder="secure password"></div>
          <div id="error-password" v-for="item in status_password" :class="[is_password ? 'input_ok' : 'input_error']">
            {{ item }}
          </div>
        </div>
        <br/>
        <p>&nbsp;</p>

        <!-- Submit Button -->
        <div>
          <button id="signup" class="button" @click="onSubmit ()" :disabled="isDisabled">
            Sign Up
          </button>
        </div>
      </div>

    </div>
    <div v-else class="displayname" >
      Authorize
    </div>
  </div>
</template>
<script>

// TODO: add authentication (test, code, doc)
// TODO: throwing 404 when adding new user...?
// DONE: add authorization (tests, code, doc)
// DONE: Fix Failed to load plugin 'nuxt'... moved form to page.form and renamed to aadform
// DONE: add AAD_API_TOKEN to environment (test, code, doc)
// DONE: add AAD_API_URL to environment (test, code, doc)
// DONE: add AAD_API_VERSION to environment (test, code, doc)
import { AADHandlers } from './mixins/AADHandlers.js'
//import { TokenHelper } from './mixins/TokenHelper.js'
import { Constants } from './mixins/Constants.js'

export default {
  data () {
    return {
      page: {
        title: 'Sign Up',
        subtitle: 'Because.'
      },
      meta: {
        displayname : {
          prompt:"Display Name",
          status:"",
          regexp: Constants.one_char()
        },
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
      aadform: {
        displayname: '',
        name: '',
        password: ''
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
      return !(this.is_displayname && this.is_username && this.is_password)
    },
    is_displayname () {
      return (this.meta.displayname.regexp.test(this.aadform.displayname.trim()))
    },
    status_displayname () {
      return (this.is_displayname ? "Ok" : "Required" )
    },
    is_username () { // true when not compliant, expects an email
      return (this.meta.username.regexp.test(this.aadform.name.trim()))
    },
    status_username () {
      return (this.is_username ? "Ok" : "Required")
    },
    is_password () {
      return (this.meta.password.regexp.test(this.aadform.password.trim()))
    },
    status_password () {
      let lst = [];

      if (!Constants.lowercase().test(this.aadform.password)) {
        lst.push("At least 1, lowercase")
      }
      if (!Constants.uppercase().test(this.aadform.password)) {
        lst.push("At least 1, uppercase")
      }
      if (!Constants.digit().test(this.aadform.password)) {
        lst.push("At least 1, digit")
      }
      if (!Constants.symbol().test(this.aadform.password)) {
        lst.push("At least 1, symbol")
      }
      if (!Constants.eight_char().test(this.aadform.password)) {
        lst.push("At least 8 characters")
      }
      return (this.is_password ? ["Ok"] : lst )
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
      return process.env.AAD_API_URL + '/adopter'
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
    isValidForm () {
      if (this.aadform.displayname.length ===0 ) {
        return false
      }
      return true
    },
    onSubmit () {
      if (!this.isValidForm()) {
        this.feedBack('display name, email and password, please!')
        return undefined
      }

      this.aadHandlers.aadAdopter(this.aadUrl, this.aadHeader, this.aadBody)
        .then((response) => {
          if (response.status === 200) {
            this.feedBack('Welcome')
          } else {
            this.feedBack('Whoa, I did not see this comming (%s)!'.replace('%s', response.status))
            this.log('Whoa, I did not see this comming (%s)!'.replace('%s', response.status))
          }
        })
        .catch((err) => {
          this.feedBack('Something unexpected happened while searching (%s)!'.replace('%s', err))
          this.log('Something unexpected happened while searching (%s)!'.replace('%s', err))
        })
    }
  }
}
</script>

<style scoped>
.band {
  width: 100%;
  height: 400px;
  /*background-color: #cccccc;*/
}

.error {
  color: #990033;
}
dt {
  text-align: left;
  font-variant: petite-caps;
  color: #990033;
  font-size: 12px;
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
