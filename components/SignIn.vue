<template>
  <div>
    <a @click="showModal()">{{page.title}}</a>
    <ModalSignIn
      v-show="isModalVisible"
      @close="closeModal"
    >
      <template v-slot:header>{{page.title}}</template>
      <template v-slot:sub-title>{{getFeedBack()}}</template>
      <template v-slot:body>
        <div class="prompt" ><label for="username">{{signin.form.username.prompt}}</label></div>
        <div>
          <input id="username" v-model="signin.form.username.value" placeholder="email">
        </div>
        <div id="error-name" :class="[is_username() ? 'input_ok' : 'input_error']">{{status_username()}}</div>
        <p>&nbsp;</p>

        <div class="prompt"><label for="password">{{signin.form.password.prompt}}</label></div>
        <div>
          <input id="password" v-model="signin.form.password.value" type="password" placeholder="password">
        </div>
        <div id="error-password" :class="[is_password() ? 'input_ok' : 'input_error']">{{status_password(signin)}}</div>
        <p>&nbsp;</p>

        <ul class="input_error" v-if="!is_password()">
          <li class="list-item" v-if="item.show" v-for="item in signin.form.password.warnings" :key="signin.form.password.warnings.warning">
            {{ item.warning }}
          </li>
        </ul>

        <button id="signin" class="button" @click="onSignIn ()" :disabled="isDisabled()">
          SignIn
        </button>
      </template>

      <template v-slot:footer>
        SignIn
      </template>
    </ModalSignIn>
  </div>
</template>
<script>

// [.Signin]:
// |not(isModalVisible)|: [*],[*]
// |"(authenticated)"|: [*],[*]
// |AAD_API_TOKEN|: Env, Authenticate

// [Config]:
// |(page)|:
import Expiration from '@/components/mixins/expiration/ExpirationMixin.js'
import { Constants } from '@/components/mixins/Constants.js'
// import GraphMixin from '@/components/mixins/graph/GraphMixin.js'
import SignInMixin from '@/components/mixins/SignInMixin.js'

// Modals
import ModalSignIn from '@/components/Modal.vue'
import { resourceUsage } from 'process'
// import { ConsoleWriter } from 'istanbul-lib-report'
/* istanbul ignore next */
export default {
  mixins: [Expiration,SignInMixin],
  components: {
    ModalSignIn
  },
  data () {
    return {
      name: "SignIn",
      isModalVisible:false,

      page: {
          "title": "Sign In",
          "subtitle": "Because",
          "feedback": ""
      },
      signin: {
        form: {
          username :{
            "value": "",
            "prompt":"User Name",
            "status":"",
            "regexp": Constants.email()
          },
          password :{
            "value": "",
            "prompt":"Password",
            "status":"",
            "regexp": Constants.password(),
            "warnings": [
              {
                "test_exp":Constants.lowercase(),
                "warning":"Lowercase",
                "show":true
              },
              {
                "test_exp":Constants.uppercase(),
                "warning":"Uppercase",
                "show":true
              },
              {
                "test_exp":Constants.digit(),
                "warning":"Numbers",
                "show":true
              },
              {
                "test_exp":Constants.symbol(),
                "warning":"Symbols","show":true
              },
              {
                "test_exp":Constants.eight_char(),
                "warning":"Length greater than 8",
                "show":true
              }
            ]
          }
        }
      }
    }
  },

  methods: {
    // [Show]: isModalVisible, not(authenticated)
    // |isModalVisible=false|: Show, [*]
    // |"(username, password)"|: Show, Authenticate

    // [*Show]: isModalVisible, not(authenticated)
    // [[Start]]:
    // ||(page)||:
    // [[Title]]:
    // [[Subtitle]]:
    // [[Username]]: not(username)
    // [[Password]]: not(password)
    // [[Feedback]]:
    // [[End]]:

    getFeedBack() {
      return this.page.feedback;
    },
    setFeedBack(msg) {
      this.page.feedback = msg;
    },
    isDisabled () {
      return !(this.is_password() && this.is_username())
    },
    is_password () { // true when not compliant, expects an email

        for (let i in this.signin.form.password.warnings) {
          this.signin.form.password.warnings[i].show = !this.signin.form.password.warnings[i].test_exp.test(this.signin.form.password.value.trim());
        }
        return (Constants.password().test(this.signin.form.password.value.trim()))
    },
    status_password () {
      return (this.is_password() ? "Ok" : "Requires");
    },
    is_username () { // true when not compliant, expects an email
        return (Constants.user_name().test(this.signin.form.username.value.trim()))
    },
    status_username () {
        return (this.is_username() ? "Ok" : "Invalid")
    },
    has_lowercase () { // true when not compliant, expects an email
      return (Constants.lowercase().test(this.signin.form.password.value.trim()))
    },
    showModal() {
      // |not(authenticated)|: [*], Config
      this.isModalVisible=true;
    },

    closeModal() {
      // set all dialog to closed/false

      this.isModalVisible = false;
    },

    assembleForm() {
      return {
          username: this.signin.form.username.value,
          password: this.signin.form.password.value
        }
    },

    onSignIn () {
      // console.log('onSignIn 1');
      const form = this.assembleForm();
      // console.log('onSignIn signInPostRequest form ', form);

      this.signInPostRequest(form)
        .then((response) => {
          // console.log('onSignIn 2', response);
          this.signInPostHandler(response);
          // console.log('onSignIn 3');
        });
      // console.log('onSignIn out');
    },

    detoken () {
      // #|Detoken|:
      this.$store.commit('detoken')
    }
  }
}
// #[SignIn-Handler]:
// #[[Store-Authentication]]:
// #[[Goto-Map]]:
// #[[Close-Modal]]:
// #[State]:
// [End]:

</script>

<style scoped>

</style>
