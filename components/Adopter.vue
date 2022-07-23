<template>
  <div class="inner-div">
    <br/>
    <h1 class="title">
      {{ getTitle() }}
    </h1>
    <h2 class="subtitle">
      {{ getSubTitle() }}
    </h2>
    <!-- HeaderSmall :title="this.getSubTitle" :subtitle="this.getSubTitle"/ -->

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
        <label for="displayname">{{meta.displayname.prompt}}</label>
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

          {{meta.username.prompt}}</label>
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
        {{meta.password.prompt}}</label>
      </div>
      <div class="input"><input id="password" v-model="form.password" type="password" placeholder="secure password"></div>

      <div id="error-password" :class="[is_password ? 'input_ok' : 'input_error']">
        {{status_password}}

      </div>

    </div>
    <br/>
    <p>&nbsp;</p>

    <!-- Feedback -->
    <h3 v-if="(typeof this.feedback !== 'undefined')">
      {{ this.getFeedback() }}
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

// [.Adopter]:
// |not(/adopter)|: [*],[*]
// |/adopter|: [*], Load
// |AAD_API_TOKEN|: Env, Load
// |CurrentUser|: AppState, Load

// [Config]:
// |(page)|: Config, Show

// Data: adopter.json
// import config from '@/components/config/adopter.json';
import Expiration from '@/components/mixins/expiration/ExpirationMixin.js'
import ServicesMixin from '@/components/mixins/service/ServiceMixin.js';
import { Constants } from '@/components/mixins/Constants.js'
import HeaderSmall from '@/components/HeaderSmall.vue'
import AdopterMixin from '@/components/mixins/adopter/AdopterMixin.js';

export default {
  name: 'Adopter',
  mixins: [Expiration, ServicesMixin, AdopterMixin],
  components: {
    HeaderSmall

  },
  // Data: props, next, Start
  props: {
    owner: String,
    id: String
  },
  data () {
    return {
      name: "Adopter",

      page: {
        title: ["Sign Up","Account"],
        subtitle: ["Because because because", "What next?"]
      },
      form: {
        displayname: "",
        username: "",
        password: ""
      },
      meta: {
        displayname: {
          prompt: "Display Name",
          status: ["Ok","Required"],
          regexp: Constants.display_name()
        },
        username:{
          prompt:"Email",
          status:["Ok","Required"],
          regexp: Constants.email()
        },
        password: {
          prompt:"Password",
          status:["Ok","A password must be at least 8 characters long and contain at least one of each of the following: a capital letter, a lowercase letter, a digit, and a punctuation Mark."],
          regexp: Constants.password()

        }
      }
    }
  },
  mounted() {
    // console.log('adopterGetRequest mounted 1');

    // [Load]:
    // |(get service.adopterGetRequest.response)|: Load, Show

    // [*Load]:

    // [[Start]]:
    // ||not(authenticated)||: [*], [*]
    // ||authenticated||: [*], AdopterGetRequest

    this.$nextTick(function () {
        // console.log('adopterGetRequest mounted 2');

      if (this.isAuthenticated) {
        // console.log('adopterGetRequest mounted 3');

        const owner = this.payload.key;
        const id = this.payload.user;

        // ||(get service.adopterGetRequest.request)||: AppState, AdopterGetRequest
        // [[AdopterGetRequest]]:
        // ||(get service.adopterGetRequest.response)||:

        this.adopterGetRequest(owner,id)
              .then((response) => {
                // console.log('adopterGetRequest mounted 4');

                // [[AdopterGetHandler]]:
                this.adopterGetHandler(response);

                // console.log('adopterGetRequest mounted 5');

                // console.log('mounted 4');
                // ||"(form)"||:

                this.adopterTransferGetData(this.form);
                // console.log('adopterGetRequest mounted 6 ');

              })
              .catch((err) => {
                  console.error('Something unexpected happened (%s)!'.replace('%s', err))
              })
              // [[End]]:

      } // auth

    }) // nexttick

  }, // mounted
  computed: {

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
      return (this.is_displayname ? this.meta.displayname.status[0] : this.meta.displayname.status[1] );
    },
    is_password () { // true when not compliant, expects lower and upper, symbol, and number
      return (Constants.password().test(this.form.password.trim()));
    },
    status_password () {
      return (this.is_password ? this.meta.password.status[0] : this.meta.password.status[1]);
    },

    is_username () { // true when not compliant, expects an email
      return (Constants.user_name().test(this.form.username.trim()))
    },
    status_username () {
      return (this.is_username ? this.meta.username.status[0] : this.meta.username.status[1])
    },
  }, // end of computed
  methods: {
    // [Show]:

    // [*Show]: /adopter
    // [[Start]]:
    // ||form||: [*], Title

    getTitle() {
      // [[Title]]:
      if (this.isAuthenticated) {
        return this.page.title[1]
      }
      return this.page.title[0]
    },

    getSubTitle() {
      // [[Subtitle]]:

      if (this.isAuthenticated) {
        return this.page.subtitle[1]
      }
      return this.page.subtitle[0]
    },

    // [[Displayname]]: edit
    // [[Username]]: edit
    // ||authenticated||: Username, [*]
    // ||not(authenticated)||: Username, Password
    // [[Password]]: edit

    setFeedback(msg) {
      this.feedback = msg;
    },
    // [[End]]:

    onSubmit (e) {
      // console.log('Adopter onSubmit 1');
      // onSubmit
      const original_id = this.payload;
      if (!this.isValidForm()) {
        // this.setFeedback('Missing Info!')
        return undefined
      }

      // console.log('Adopter onSubmit 2');

      const form = JSON.parse(JSON.stringify(this.form)) // copy
      const claims = this.payload;
      const owner = claims.key;
      //  (upsert, owner, id, form) -->
      if(this.payload.key === "0") {
        // console.log('Adopter onSubmit 3 post');
        this.adopterPostRequest (form)
        .then((response) => {

          // console.log('Adopter onSubmit 3.1 post ', response);
          this.adopterPostHandler(response);

        });
      } else {
        // console.log('Adopter onSubmit 4 put');
        let id = original_id.user ; // email
        this.adopterPutRequest (owner, id, form)
        .then((response) => {

          // console.log('Adopter onSubmit 4.1 put ', response);
          this.adopterPutHandler(response);

        });
      }

    },
    isValidForm () {
      if (this.form.displayname.length ===0 ) {
        return false;
      }
      return true;
    },
  }, // methods
  // [End]:

}
</script>

<style scoped>

</style>
