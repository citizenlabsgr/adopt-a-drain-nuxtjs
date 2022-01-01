<template>
  <div class="inner-div">
    <br/>
    <HeaderSmall :title="this.getTitle" :subtitle="this.getSubTitle"/>

    <!-- HeaderSmall :title="isAuthenticated ? 'Update' :'Sign Up'" subtitle="{{ page.subtitle }}"/ -->
    <!-- ------------ -->
    <!-- Display username -->
    <!-- ------------ -->
    <br/>
    
    <div>
      <!-- ------------ -->
      <!-- Display Name -->
      <!-- ------------ -->
      <div class="prompt" >
        <label for="displayname">Display Name</label>
      </div>
      <div class="input">
        <input id="displayname"
               v-model="form.displayname"
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
          Name</label>
        </div>
        <div class="input"><input id="username" v-model="form.username" placeholder="your email"></div>
        <div id="error-name" :class="[is_username ? 'input_ok' : 'input_error']">
          {{status_username}}
        </div>
    </div>
    <!-- ------------ -->
    <!-- Password -->
    <!-- ------------ -->
    <div v-if="!isAuthenticated">
      <div class="prompt" ><label for="password">
        Password</label>
      </div>
      <div class="input"><input id="password" v-model="form.password" type="password" placeholder="secure password"></div>
      <!-- div class="input"><input id="password" v-model="form.password" type="password" placeholder="secure password" :disabled="isAuthenticated"></div -->
      
      <div id="error-password" :class="[is_password ? 'input_ok' : 'input_error']">
          {{status_password}}
      </div>
      
      <!-- div id="error-password-list" v-for="item in meta.password.errors"  v-bind:key="item.id" :class="[is_password ? 'input_ok' : 'input_error']">
        {{ item.id }}
      </div -->

    </div>
    <br/>
    <p>&nbsp;</p>
    <!-- ------------ -->
    <!-- Submit Button -->
    <!-- ------------ -->

    <div>
      <button id="signup" class="button" @click="onSubmit()" :disabled="isDisabled">
        {{ isAuthenticated ? 'Update': 'Save' }}
      </button>

    </div>

  </div>
</template>

<script>
import atob from 'atob'
import Expiration from '@/components/mixins/ExpirationMixin.js'
import { Constants } from '@/components/mixins/Constants.js'
import HeaderSmall from '@/components/HeaderSmall.vue'
import { AADHandlers } from '@/components/mixins/AADHandlers.js'

export default {
  name: 'Account',  
  mixins: [Expiration],
  components: {
    HeaderSmall,
    // Button
  }, 
  props: {
    owner: String,
    id: String
  }, 
  data () {
    return {
      page: {
        title: ['Sign Up', 'Update'],
        subtitle: ['Because because because', 'What next?'],
        feedback: ''
      },
      form: {
        displayname: '',
        username: '',
        password: ''
      },
      meta: {
        displayname : {
          prompt:"Display Name",
          status:"",
          regexp: Constants.display_name()
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
    }  
  },
computed: {
    getTitle() {
      if (this.isAuthenticated) {
        return this.page.title[1]
      }
      return this.page.title[0]
    },
    getSubTitle() {
      if (this.isAuthenticated) {
        return this.page.subtitle[1]
      }
      return this.page.subtitle[0]
    },
    isDisabled () {
      let rc = false;
      if (this.isAuthenticated) {
          rc = (this.is_username && this.is_displayname);
      } else {
          rc = (this.is_password && this.is_username && this.is_displayname);
      }
      return !rc;
    },
    /*
    isDisabled () {
      return !(this.is_password && this.is_username && this.is_displayname)
    },
    */
    is_displayname () {
      return (this.meta.displayname.regexp.test(this.form.displayname.trim()))
    },
    status_displayname () {
      return (this.is_displayname ? "Ok" : "Required" )
    },
    is_password () { // true when not compliant, expects lower and upper, symbol, and number
      return (Constants.password().test(this.form.password.trim()))
    },
    status_password () {
      this.meta.password.errors=[]
      if (!Constants.lowercase().test(this.form.password)) {
        this.meta.password.errors.push({"id": "At least 1, lowercase"})
      }
      if (!Constants.uppercase().test(this.form.password)) {
        this.meta.password.errors.push({"id": "At least 1, uppercase"})
      }
      if (!Constants.digit().test(this.form.password)) {
        this.meta.password.errors.push({"id": "At least 1, digit"})
      }
      if (!Constants.symbol().test(this.form.password)) {
        this.meta.password.errors.push({"id": "At least 1, symbol"})
      }
      if (!Constants.eight_char().test(this.form.password)) {
        this.meta.password.errors.push({"id": "At least 8 characters"})
      }
      return (this.is_password ? "Ok" : "Required" )
    },
    is_username () { // true when not compliant, expects an email
      return (Constants.user_name().test(this.form.username.trim()))
    },
    status_username () {
      return (this.is_username ? "Ok" : "Required")
    },
  }, // end of computed
  methods: {

    onSubmit (e) {
      // [onSubmit]
      const original_id = this.payload;
      if (!this.isValidForm()) {
        // this.setFeedback('Missing Info!')
        return undefined
      }
      const form = JSON.parse(JSON.stringify(this.form)) // copy
      const claims = this.payload;
      const owner = claims.key;
      //  (upsert, owner, id, form) -->

      this.$emit('upsert', this.owner, this.id, form);
    },
    isValidForm () {
      if (this.form.displayname.length ===0 ) {
        return false;
      }
      return true;
    }
    
  },
  mounted() {
    this.$nextTick(function () {
        this.form.displayname = '';
        this.form.username = '';
        this.form.password = '';
        if (this.isAuthenticated) {
          const owner = this.payload.key;
          const id = this.payload.user;
          const aadUrl = `${process.env.AAD_API_URL}/adopter/${owner}/${id}`; 
          const aadHeader = {
             "Accept":"application/json",
             'Authorization': `Bearer ${this.current_token}`,
             'Content-Type': 'application/json'
          };

          new AADHandlers(this).aadAdopterGet(aadUrl, aadHeader)
            .then((response) => {
              if (response.status === 200) {
                switch(response.data.status) {
                  case '200':
                    this.form.displayname = response.data.selection[0].form.displayname;
                    this.form.username = response.data.selection[0].form.username;
                    this.form.password = '';
                    break;
                  default:
                    console.error('Not sure what just happened');
                    // console.error('response', response.data);
                }
              } else {
                console.error('Whoa, I did not see that comming (%s)!'.replace('%s', response.status))
              }
            })
            .catch((err) => {
              console.error('Something unexpected happened (%s)!'.replace('%s', err))
            })
          
      }
    })
  }
  
}
</script>

<style scoped>

</style>
