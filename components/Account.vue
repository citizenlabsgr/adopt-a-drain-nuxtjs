<template>
  <div class="inner-div">
    <br/>
    <HeaderSmall :title="this.getTitle" :subtitle="this.getSubTitle"/>
        <!-- HeaderSmall :title="isAuthenticated ? this.page.title[1] : this.page.title[0]" subtitle="because"/ -->

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
    <div>
      <div class="prompt" ><label for="password">
        Password</label>
      </div>
      <div class="input"><input id="password" v-model="form.password" type="password" placeholder="secure password"></div>
      
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
    
    <!-- div class="feedback">
      {{ page.feedback }} {{ page.center }}
    </ -->
  </div>
</template>

<script>
import Expiration from '@/components/mixins/ExpirationMixin.js'
import { Constants } from '@/components/mixins/Constants.js'
// import { AADHandlers } from '@/components/mixins/AADHandlers.js'
import HeaderSmall from '@/components/HeaderSmall.vue'
// import Button from '@/components/Button.vue'

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
      return !(this.is_password && this.is_username && this.is_displayname)
    },
    /*
    is_id() {
      if (this.form.id === '0') {
        return false;
      }
      return true;
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
      // let lst = [];
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
    /*
    getId() {
      console.log('getId ',this.id);
      return this.id;
    },
    */
    onSubmit (e) {
      console.log('[onSubmit]');
      console.log('currnent token', this.payload.user );
      const original_id = this.payload;
      if (!this.isValidForm()) {
        // this.setFeedback('Missing Info!')
        return undefined
      }
      // this.form.displayname = displayname ;
      // console.log('onSubmit emit data upward to page')
      const form = JSON.parse(JSON.stringify(this.form)) // copy
      // const claims = JSON.parse(atob(token.split('.')[1]));
      const claims = this.payload;
      // console.log('upsert payload', this.payload);
      const owner = claims.key;
      // form.id = this.getId();
      console.log('  (upsert, owner, id, form) -->');
      console.log('   owner = ',this.owner);
      console.log('   id    = ',this.id);
      console.log('   form  = ',form);

      this.$emit('upsert', this.owner, this.id, form);
    },
    isValidForm () {
      if (this.form.displayname.length ===0 ) {
        return false
      }
      return true
    }
    
  },
  
}
</script>

<style scoped>

</style>
