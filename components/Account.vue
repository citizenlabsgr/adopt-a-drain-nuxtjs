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
        hey
      </div>

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
// import atob from 'atob'

import Expiration from '@/components/mixins/expiration/ExpirationMixin.js'
import { Constants } from '@/components/mixins/Constants.js'
import HeaderSmall from '@/components/HeaderSmall.vue'
import { AADHandlers } from '@/components/mixins/AADHandlers.js'
import GraphMixin from '@/components/mixins/graph/GraphMixin.js'

export default {
  name: 'Account',
  mixins: [Expiration,GraphMixin],
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
      name: 'Account',
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
      return (this.is_password ? "Ok" : "xA password must be at least 8 characters long and contain at least one of each of the following: a capital letter, a lowercase letter, a digit, and a punctuation Mark.");
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
      this.clearGraph();
      this.addStart();
      this.addSpace();
      this.addGlyph(' [ Collect ] .',       '. [ Account Values ] ');
      this.addSpace();
      this.addGlyph(this.down,                '  (displayname, username, password)');
      this.addSpace();
      this.addGlyph(` [ Save ${this.name} ] .`,'. [ Emit upsert ] ');
      this.addSpace();

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
      // console.log('Emit Upsert');
      this.$emit('upsert', this.owner, this.id, form);
      console.log(this.getGraph());
    },
    isValidForm () {
      if (this.form.displayname.length ===0 ) {
        return false;
      }
      return true;
    }

  },
  mounted() {
    this.addStart();
    this.addSpace();

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
          this.addGlyph(` [ Mount ${this.name} ] `,this.start);
          this.addSpace();
          new AADHandlers(this).aadAdopterGet(aadUrl, aadHeader)
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
    })
  }

}
</script>

<style scoped>

</style>
