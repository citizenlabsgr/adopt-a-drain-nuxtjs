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
// [.SignOut]:
// |isModalVisible=false|: [*], [*]
// |not(authenticated)|: [*], [*]
// [Start]:
// |"(authenticated)"|:

// [Config]:
// |token|:
// [Show]: authenticated
// |not(authenticated)|: Show, [*]
// [[Start]]:
// ||token||:
// [[LogOut]]:
// ||not(authenticated)||:

import Expiration from '@/components/mixins/expiration/ExpirationMixin.js'
import { Constants } from '@/components/mixins/Constants.js'
// Modals
import ModalSignOut from '@/components/Modal.vue'
/* istanbul ignore next */
export default {
  mixins: [Expiration],
  components: {
    ModalSignOut
  },
  data () {
    return {
      name: "SignOut",
 
     isModalVisible:false,
      signout: {
        page: {
          "title": "Sign Out",
          "subtitle": "Gotta go",
          "feedback": ""
        },
        form: {
          "username": {
            "value": "",
            "prompt":"User Name",
            "status":"",
            "regexp": Constants.email()
          },
          password: {
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
                "warning":"Symbols",
                "show":true
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
// [End]:
</script>

<style scoped>

</style>
