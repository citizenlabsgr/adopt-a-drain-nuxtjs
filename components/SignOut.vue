<template>
  <div>
    <a @click="showModal()">Sign-Out</a>

    <ModalSignOut
      v-show="isModalVisible"
      @close="closeModal"
    >
      <template v-slot:header>Sign Out</template>
      <template v-slot:sub-title>Ok, Bye</template>
      <template v-slot:body>
        <button id="signout" class="button" @click="onSignOut ()">
          signout
        </button>
      </template>
      <template v-slot:footer>
        signout
      </template>
    </ModalSignOut>

   
  </div>
</template>
<script>

import Expiration from '@/components/mixins/expiration/ExpirationMixin.js'
import { Constants } from '@/components/mixins/Constants.js'
// Modals
import ModalSignOut from '@/components/Modal.vue'
/* istanbul ignore next */
export default {
  mixins: [Expiration],
  components: {
    ModalSignOut,
    
  },
  data () {
    return {
      name: "SignOut",
 
     isModalVisible:false,
      signout: {
        page: {
          title: 'Sign Out',
          subtitle: 'Gotta go',
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
        for (let i in this.signout.meta.password.warnings) {
          this.signout.meta.password.warnings[i].show = !this.signout.meta.password.warnings[i].test_exp.test(this.signout.aadform.password.trim());
        }
        return (Constants.password().test(this.signout.aadform.password.trim()))
    },
    status_password () {
      return (this.is_password() ? "Ok" : "Requires");
    },
    is_username () { // true when not compliant, expects an email
        return (Constants.user_name().test(this.signout.aadform.username.trim()))
    },
    status_username () {
        return (this.is_username() ? "Ok" : "Invalid")
    },
   
    showModal() {
      this.isModalVisible=true;
    },
    closeModal() {
      // set all dialog to closed/false
      this.isModalVisible = false;
    },
    onSignOut () {
      this.$store.commit('detoken'); 
    }
  }
}
</script>

<style scoped>

</style>
