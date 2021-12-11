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
    <!-- Display username -->
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
        <div class="input"><input id="username" v-model="aadform.username" placeholder="your email"></div>
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
      
      <div id="error-password" :class="[is_password ? 'input_ok' : 'input_error']">
          {{status_password}}
      </div>
      
      <div id="error-password-list" v-for="item in meta.password.errors"  v-bind:key="item.id" :class="[is_password ? 'input_ok' : 'input_error']">
        {{ item.id }}
      </div>

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
    <div>
      <button id="update" class="button" @click="onSubmit ()" :disabled="isDisabled">
        Update
      </button>
    </div> 
    <div class="feedback">
      {{ page.feedback }} {{ page.center }}
    </div>
  </div>
</template>

<script>
import { Constants } from '@/components/mixins/Constants.js'
import { AADHandlers } from '@/components/mixins/AADHandlers.js'
/* istanbul ignore next */ 
export default {
  data () {
    return {
      page: {
        title: 'Sign Up',
        subtitle: 'Because because because',
        feedback: ''
      },
      aadform: {
        displayname: '',
        username: '',
        password: ''
      },
      meta: {
        displayname : {
          prompt:"Display Name",
          status:"",
          regexp: Constants.one_char()
        },
        username :{
          prompt:"Email",
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
      // current_token: this.$store.state.token
    }
  },
  computed: {

    isDisabled () {
      return !(this.is_password && this.is_username)
    },
    is_displayname () {
      return (this.meta.displayname.regexp.test(this.aadform.displayname.trim()))
    },
    status_displayname () {
      return (this.is_displayname ? "Ok" : "Required" )
    },
    is_password () { // true when not compliant, expects lower and upper, symbol, and number
      return (Constants.password().test(this.aadform.password.trim()))
    },
    status_password () {
      // let lst = [];
      this.meta.password.errors=[]
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
      return (this.is_password ? "Ok" : "Required" )

    },
    is_username () { // true when not compliant, expects an email
      return (Constants.user_name().test(this.aadform.username.trim()))
    },
    status_username () {
      return (this.is_username ? "Ok" : "Required")
    }
  }, // end of computed
  methods: {
    setFeedback(msg) {
      this.page.feedback = msg;
    },
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
        this.setFeedback('Missing Info!')
        return undefined
      }
      const aadHeader = {
        "Accept":"application/json",
        'Authorization': `Bearer ${process.env.AAD_API_TOKEN}`,
        'Content-Type': 'application/json'
      };
      const aadUrl = process.env.AAD_API_URL + '/signup';
      const aadBody = JSON.stringify(this.aadform);
      
      new AADHandlers(this).aadAdopter(aadUrl, aadHeader, aadBody)
        .then((response) => {
          if (response.status === 200) {
            // console.log('response', response.data);
            
            switch(response.data.status) {
              case '200':
                this.setFeedback('Welcome');
                break;
              case '409':
                this.setFeedback('Email already taken!');
                break;
              default:
                this.setFeedback('Not sure what just happened');
                console.log('Not sure what just happened');
            }
          } else {
            console.log('Whoa, I did not see that comming (%s)!'.replace('%s', response.status))
          }
        })
        .catch((err) => {
          console.error('Something unexpected happened (%s)!'.replace('%s', err))
        })
    },
  }
}
</script>

<style scoped>

</style>
