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
// Modals
import ModalSignIn from '@/components/Modal.vue'
// import ModalSignOut from '@/components/Modal.vue'
/* istanbul ignore next */
export default {
  mixins: [Expiration],
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

      const aadUrl = process.env.AAD_API_URL + '/signin';
      // const aadBody = JSON.stringify(this.aadform);
      const aadBody = this.signin.aadform;

      const aadHeader = {
        "Accept":"application/json",
        'Authorization': `Bearer ${process.env.AAD_API_TOKEN}`,
        'Content-Type': 'application/json'
      };

      new AADHandlers(this).aadSignin(
          aadUrl,
          aadHeader,
          aadBody
        ).then((response) => {

          if (response.status === 200) {

             switch(response.data.status) {
              case '200':
                this.setCurrentToken(response.data.token);
                console.log('Go find a drain to adopt!');
                this.$router.push('/'); // to map
                this.closeModal();
                break;
              case '404':
                console.error('User not found!');
                break;

              default:
                console.log('Not sure what just happened');
                console.log('Not sure what just happened');
            }
          }

        })
        .catch((err) => {
          this.detoken();
          if (err.message.includes('403')) {
            /* eslint-disable no-console */
            console.error('Have you signed up?');
            /* eslint-enable no-console */
          } else {
            /* eslint-disable no-console */
            console.error('Something unexpected happened while searching (%s)!'.replace('%s', err));
            /* eslint-enable no-console */
          }
        })
    },
    detoken () {
      this.$store.commit('detoken')
    }
  }
}
</script>

<style scoped>

</style>
