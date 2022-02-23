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

      <div id="error-password" :class="[is_password ? 'input_ok' : 'input_error']">
        {{status_password}}
        
      </div>

    </div>
    <br/>
    <p>&nbsp;</p>

    <!-- Feedback -->
    <h3>
      {{ this.page.feedback }}
    </h3>

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
// import atob from 'atob'

import Expiration from '@/components/mixins/expiration/ExpirationMixin.js'
import { Constants } from '@/components/mixins/Constants.js'
import HeaderSmall from '@/components/HeaderSmall.vue'
import GraphMixin from '@/components/mixins/graph/GraphMixin.js'
import AdopterMixin from '@/components/mixins/adopter/AdopterMixin.js';

export default {
  name: 'Adopter',
  mixins: [Expiration,GraphMixin,AdopterMixin],
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
      name: 'Adopter',
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
    is_displayname () {
      return (this.meta.displayname.regexp.test(this.form.displayname.trim()));
    },
    status_displayname () {
      return (this.is_displayname ? "Ok" : "Required" );
    },
    is_password () { // true when not compliant, expects lower and upper, symbol, and number
      return (Constants.password().test(this.form.password.trim()));
    },
    status_password () {
      return (this.is_password ? "Ok" : "A password must be at least 8 characters long and contain at least one of each of the following: a capital letter, a lowercase letter, a digit, and a punctuation Mark.");
    },

    is_username () { // true when not compliant, expects an email
      return (Constants.user_name().test(this.form.username.trim()))
    },
    status_username () {
      return (this.is_username ? "Ok" : "Required")
    },
  }, // end of computed
  methods: {
    setFeedback(msg) {
      this.page.feedback = msg;
    },

    onSubmit (e) {
      this.clearGraph();
      this.addStart('onSubmit');


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

      this.addSpace();
      this.addGlyph(' [ Collect ] .', ` (${this.formatOutput(this.form)}) `);
      this.addSpace();
      // this.addGlyph(this.down,' [ E mit upsert ] ');
      // this.addSpace();

      this.upsert(this.owner, this.id, form);
      // this.$e mit('upsert', this.owner, this.id, form);

      // console.log(this.getGraph());
    },
    isValidForm () {
      if (this.form.displayname.length ===0 ) {
        return false;
      }
      return true;
    },



  }, // methods
  mounted() {

    this.addMount(this.name); // graph

    this.$nextTick(function () {
        this.form.displayname = '';
        this.form.username = '';
        this.form.password = '';
        // run when logged in
        if (this.isAuthenticated) {
            this.loadAdopter();
        }

        /*
        if (this.isAuthenticated) {

          const owner = this.payload.key;
          const id = this.payload.user;
          const aadUrl = `${process.env.AAD_API_URL}/adopter/${owner}/${id}`;

          const aadHeader = {
             "Accept":"application/json",
             'Authorization': `Bearer ${this.current_token}`,
             'Content-Type': 'application/json'
          };

          this.addGlyph(` [ Mount ${this.name} ] `,this.start);
          this.addSpace();

          new RequestAdopter.Get(owner,id)
            .then((response) => {
              if (response.status === 200) {
                switch(response.data.status) {
                  case '200':
                    this.form.displayname = response.data.selection[0].form.displayname;
                    this.form.username = response.data.selection[0].form.username;
                    this.form.password = '';
                    this.addSpace();
                    this.addGlyph(this.down,'  (displayname,username,password)');

                    break;
                  default:
                    console.error('Not sure what just happened');
                    // console.error('response', response.data);
                }
                console.log(this.getGraph());
              } else {

                console.error('Whoa, I did not see that comming (%s)!'.replace('%s', response.status))
              }
            })
            .catch((err) => {

              console.error('Something unexpected happened (%s)!'.replace('%s', err))
            })

      }
      */
    }) // nexttick

  } // mounted

}
</script>

<style scoped>

</style>
