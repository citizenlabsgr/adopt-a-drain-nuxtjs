<template>
  <div>
    <!--button type="button" class="btn" @click="showModal()">
      SignIn
    </button -->
    <a @click="showModal()">Sign-In</a>
    <ModalSignIn
      v-show="isModalVisible"
      @close="closeModal"
    >
      <template v-slot:header>Sign In</template>
      <template v-slot:sub-title>Because, because</template>
      <template v-slot:body>
        <div class="prompt" ><label for="username">{{signin.meta.username.prompt}}</label></div>
        <div>
          <input id="username" v-model="signin.aadform.username" placeholder="email">
        </div>
        <div id="error-name" :class="[is_username() ? 'input_ok' : 'input_error']">{{status_username()}}</div>
        <p>&nbsp;</p>

        <div class="prompt"><label for="password">{{signin.meta.password.prompt}}</label></div>
        <div>
          <input id="password" v-model="signin.aadform.password" type="password" placeholder="password">
        </div>
        <div id="error-password" :class="[is_password() ? 'input_ok' : 'input_error']">{{status_password(signin)}}</div>
        <p>&nbsp;</p>
        <ul class="input_error" v-if="!is_password()">
          <li class="list-item" v-if="item.show" v-for="item in signin.meta.password.warnings" :key="signin.meta.password.warnings.warning">
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

import Expiration from '@/components/mixins/ExpirationMixin.js'
import { Constants } from '@/components/mixins/Constants.js'
import { AADHandlers } from '@/components/mixins/AADHandlers.js'
import GraphMixin from '@/components/mixins/graph/GraphMixin.js'
import SignInMixin from '@/components/mixins/SignInMixin.js'

// Modals
import ModalSignIn from '@/components/Modal.vue'
// import ModalSignOut from '@/components/Modal.vue'
/* istanbul ignore next */
export default {
  mixins: [Expiration,SignInMixin,GraphMixin],
  components: {
    ModalSignIn,

  },
  data () {
    return {
      name: "SignIn",
      isModalVisible:false,
      signin: {
        page: {
          title: 'Sign In',
          subtitle: 'Because',
          feedback: ''
        },
        aadform: {
          username: '',
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
            regexp: Constants.password(),
            warnings: [
              {"test_exp":Constants.lowercase(), "warning":"Lowercase","show":true},
              {"test_exp":Constants.uppercase(), "warning":"Uppercase","show":true},
              {"test_exp":Constants.digit(),"warning":"Numbers","show":true},
              {"test_exp":Constants.symbol(), "warning":"Symbols","show":true},
              {"test_exp":Constants.eight_char(), "warning":"Length greater than 8","show":true}
            ]
          }
        }
      }
    }
  },
  methods: {
    isDisabled () {
      return !(this.is_password() && this.is_username())
    },
    is_password () { // true when not compliant, expects an email
        for (let i in this.signin.meta.password.warnings) {
          this.signin.meta.password.warnings[i].show = !this.signin.meta.password.warnings[i].test_exp.test(this.signin.aadform.password.trim());
        }
        return (Constants.password().test(this.signin.aadform.password.trim()))
    },
    status_password () {
      return (this.is_password() ? "Ok" : "Requires");
    },
    is_username () { // true when not compliant, expects an email
        return (Constants.user_name().test(this.signin.aadform.username.trim()))
    },
    status_username () {
        return (this.is_username() ? "Ok" : "Invalid")
    },
    has_lowercase () { // true when not compliant, expects an email
      return (Constants.lowercase().test(this.signin.aadform.password.trim()))
    },
    showModal() {
      this.isModalVisible=true;
    },
    closeModal() {
      // set all dialog to closed/false
      this.isModalVisible = false;
    },

    onSignIn () {

      this.addStart();
      this.addSpace();
      this.addGlyph(' [ Collect Credentials ] .', '. (username, password) ');
      this.addSpace();

      this.requestSignIn(this.signin.aadform, this.graph)
        .then((response) => {
          this.responseSignIn(response, this.graph);
          this.setCurrentToken(this.tokenSignIn, this.graph);

          console.log('Go find a drain to adopt!');

          this.addSpace();
          this.addGlyph(this.down,' [ Goto Map ] ');
          // Goto Map
          this.$router.push('/'); // to map

          this.addSpace();
          this.addGlyph(this.down,' [ Close Modal ] ');
          // Close Modal
          this.closeModal();

          this.addSpace();
          this.addEnd();
          // Show Graph
          console.log(this.getGraph());
        })
        .catch((err) => {
          this.addGlyph(this.down,` [ Error ${err} ]`);
          this.addSpace();
          this.addEnd();
          console.log(this.getGraph());
        });

    },

    detoken () {
      this.$store.commit('detoken')
    }
  }
}
</script>

<style scoped>

</style>
