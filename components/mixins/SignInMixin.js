
import { ResponseHelper } from '@/components/mixins/ResponseHelper.js';

export default {
  data () {
    return {
      name: "SignInMixin",
      tokenSignIn: false,
      statusSignIn: false,
      msgSignIn: false,
      service: {
        "signInPostRequest": {
          "request": {
            "username": "j@citizenlabs.org", 
            "password": "a1A!aaaa"
          },
          "response":{

          }
        }
      }
    }
  },
  methods: {
    
    async signInPostRequest(form) {
      // aka signin, or login
      const aadUrl = `${process.env.AAD_API_URL}/signin`;
      const aadData = form;
      const aadHeaders = {
        "Accept":"application/json",
        'Authorization': `Bearer ${process.env.AAD_API_TOKEN}`,
        'Content-Type': 'application/json'
      };
      return await this.$axios({
            url: aadUrl,
            method: 'post',
            headers: aadHeaders,
            data: aadData 
      });
    },

    signInPostHandler(response) {
        // this.statusSignIn = response.data.status;
        // this.msgSignIn = response.data.msg;
        
        const helper = new ResponseHelper(response);
        let status = helper.status(); // this.response.data.status;
        let msg = helper.msg();

        switch(status) {
         case '200':
           this.tokenSignIn = response.data.token;
           this.setCurrentToken(response.data.token);

          console.log('Go find a drain to adopt!');

          // Goto Map
          this.$router.push('/'); // to map

          // Close Modal
          this.closeModal();
           break;

         case '404':
           // this.msgSignin = 'User not found!';
           console.error("User not found!");
           break;

         default:
           this.msgSignin = "Not sure what just happened!";
           console.error(`signInPostHandler Not sure what just happened! ${status} ${msg}`);
        }


    }
  },
}