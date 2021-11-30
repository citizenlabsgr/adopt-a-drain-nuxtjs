<template>

  <div class="inner-div">
    <br/>
    <h1 class="title">
      {{ page.title }}
    </h1>
    <hr/>
    <h2 class="subtitle">
      {{ page.subtitle }}
    </h2>
    <!-- ------------ -->
    <!-- Display username -->
    <!-- ------------ -->
    <div>
      <!--div class="prompt">{{meta.displayname.prompt}}</div-->
      <div class="prompt" >
        <label for="displayname">{{meta.displayname.prompt}}</label>
      </div>
      <div class="input">
        <input id="displayname"
               v-model="aadform.displayname"
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
        <div class="input"><input id="username" v-model="aadform.username" placeholder="your email"></div>
        <div id="error-name" :class="[is_username ? 'input_ok' : 'input_error']">
          {{status_username}}
        </div>
    </div>
    <div>
      <button id="save" class="button" @click="onSave ()" :disabled="isDisabled">
        Save
      </button>
    </div>
  </div>
</template>

<script>
import Expiration from '@/components/mixins/ExpirationMixin.js'
import { Constants } from '@/components/mixins/Constants.js'
import { AADHandlers } from '@/components/mixins/AADHandlers.js'
export default {
  mixins: [Expiration],
  data () {
    /* istanbul ignore next */ 
    return {
      page: {
        title: 'Account',
        subtitle: 'Your Information x'
      },
      aadform: {
        displayname: '',
        username: '',
        password: ''
      },
      meta: {
        displayname : {
          prompt:"Display Name",
          status:"",
          regexp: Constants.one_char()
        },
        username :{
          prompt:"User Name",
          status:"",
          regexp: Constants.email()
        }
      }
    }
  }, // end of data
  computed: {
    is_displayname () {
      return (this.meta.displayname.regexp.test(this.aadform.displayname.trim()));
    },
    status_displayname () {
      return (this.is_displayname ? "Ok" : "Required" );
    },
    is_username () { // true when not compliant, expects an email
      return (Constants.user_name().test(this.aadform.username))
    },
    status_username () {
      return (this.is_username ? "Ok" : "Required")
    }
  },
  methods: {
    setDisplayName (displayname) {
      this.aadform.displayname = displayname ;
    }
  },
  mounted () {

    // go get user data, /adopter
    
   
    console.log('mount ', this.$store.token);
    const aadUrl = process.env.AAD_API_URL + '/adopter';
    const aadHeader = {
        "Accept":"application/json",
        'Authorization': `Bearer ${this.$store.token}`,
        'Content-Type': 'application/json'
      };
    const aadBody = {};  
    new AADHandler(this).aadAdopterGet(
      aadUrl,
      aadHeader,
      aadBody)
    .then((response) => {
          if (response.status === 200) {
            // console.log('response', response.data);
            switch(response.data.status) {
              case '200':
                console.log('OK', response);
                // this.setFeedback('Welcome');
                // this.aadform.displayname = this.displayname;
                // this.aadform.username = this.username;
                break;
              
              default:
                //this.setFeedback('Not sure what just happened');
                console.log('Not sure what just happened');
            }
          } else {
            console.log('Whoa, I did not see that comming (%s)!'.replace('%s', response.status))
          }
        })
        .catch((err) => {
          console.log('Something unexpected happened (%s)!'.replace('%s', err))
        });
    // set screen 
    
  }  
}
</script>

<style scoped>

</style>
