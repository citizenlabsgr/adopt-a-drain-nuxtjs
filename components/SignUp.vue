<template>
  <div class="inner-div">
    
    <br/>
    <h1 id="title" class="title">
      {{ page.title }}
    </h1>
    <hr/>
    <h2 class="subtitle">
      {{ page.subtitle }}
    </h2>
    <!-- ------------ -->
    <!-- Display Name -->
    <!-- ------------ -->
    <div>
      <!--div class="prompt">{{meta.displayname.prompt}}</div-->
      <div class="prompt" >
        <label for="displayname">{{meta.displayname.prompt}}</label>
      </div>
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

    <!-- ------------ -->
    <!-- User Name -->
    <!-- ------------ -->
    <div>
        <div class="prompt" ><label for="username">
          {{meta.username.prompt}}</label>
        </div>
        <div class="input"><input id="username" v-model="aadform.name" placeholder="your email"></div>
        <div id="error-name" :class="[is_username ? 'input_ok' : 'input_error']">
          {{status_username}}
        </div>
    </div>
    <!-- ------------ -->
    <!-- Password -->
    <!-- ------------ -->
    <div>
      <div class="prompt" ><label for="password">{{meta.password.prompt}}</label></div>
      <div class="input"><input id="password" v-model="aadform.password" type="password" placeholder="secure password"></div>
      <div id="error-password" v-for="item in meta.password.errors"  v-bind:key="item.id" :class="[is_password ? 'input_ok' : 'input_error']">
        {{ item }}
      </div>
      <!-- div id="error-password" v-for="item in status_password"  v-bind:key="item.id" :class="[is_password ? 'input_ok' : 'input_error']">
        {{ item }}
      </div -->
    </div>
    <br/>
    <p>&nbsp;</p>
    <!-- ------------ -->
    <!-- Submit Button -->
    <!-- ------------ -->
    <div>
      <button id="signup" class="button" @click="onSubmit ()" :disabled="isDisabled">
        Sign Up
      </button>
    </div>

  </div>
</template>

<script>
import { Constants } from '@/components/mixins/Constants.js'
import { AADHandlers } from '@/components/mixins/AADHandlers.js'
// import { TokenHelper } from './mixins/TokenHelper.js'
/* istanbul ignore next */ 
export default {
  data () {
    return {
      page: {
        title: 'Sign Up',
        subtitle: 'Because'
      },
      aadform: {
        displayname: '',
        name: '',
        password: ''
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
          regexp: Constants.password(),
          errors: []
        }
      }
      // adopter_token: this.$store.state.token
    }
  },
  computed: {
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
    },
    isDisabled () {
      return !(this.is_password && this.is_username)
    },
    is_displayname () {
      return (this.meta.displayname.regexp.test(this.aadform.displayname.trim()))
    },
    status_displayname () {
      return (this.is_displayname ? "Ok" : "Required" )
    },
    is_password () { // true when not compliant, expects an email
      return (Constants.password().test(this.aadform.password.trim()))
    },
    status_password () {
      let lst = [];

      if (!Constants.lowercase().test(this.aadform.password)) {
        this.meta.password.errors.push({"id": "At least 1, lowercase"})
      }
      if (!Constants.uppercase().test(this.aadform.password)) {
        this.meta.password.errors.push({"id": "At least 1, uppercase"})
      }
      if (!Constants.digit().test(this.aadform.password)) {
        this.meta.password.errors.push({"id": "At least 1, digit"})
      }
      if (!Constants.symbol().test(this.aadform.password)) {
        this.meta.password.errors.push({"id": "At least 1, symbol"})
      }
      if (!Constants.eight_char().test(this.aadform.password)) {
        this.meta.password.errors.push({"id": "At least 8 characters"})
      }
      // return (this.is_password ? ["Ok"] : lst )

    },
    is_username () { // true when not compliant, expects an email
      return (Constants.user_name().test(this.aadform.name.trim()))
    },
    status_username () {
      return (this.is_username ? "Ok" : "Required")
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
  }, // end of computed
  methods: {
    log (msg) {
      /* eslint-disable no-console */
      console.log(msg)
      /* eslint-enable no-console */
    },
    isValidForm () {
      if (this.aadform.displayname.length ===0 ) {
        return false
      }
      return true
    },
    onSubmit () {
      if (!this.isValidForm()) {
        this.log('display name, email and password, please!')
        return undefined
      }

      this.aadHandlers.aadAdopter(this.aadUrl, this.aadHeader, this.aadBody)
        .then((response) => {
          if (response.status === 200) {
            this.log('Welcome')
          } else {
            //this.feedBack('Whoa, I did not see this comming (%s)!'.replace('%s', response.status))
            this.log('Whoa, I did not see this comming (%s)!'.replace('%s', response.status))
          }
        })
        .catch((err) => {
          //this.feedBack('Something unexpected happened while searching (%s)!'.replace('%s', err))
          this.log('Something unexpected happened while searching (%s)!'.replace('%s', err))
        })
    },

  }
}
</script>

<style scoped>

</style>
