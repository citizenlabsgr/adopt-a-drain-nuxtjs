import atob from 'atob';
// import { DWHandlers } from '@/components/mixins/DWHandlers.js'
export default {
  data () {
    return {
      name: 'SignInMixin',
      tokenSignIn: false,
      statusSignIn: false,
      msgSignIn: false,
    };
  },
  methods: {

    getSignIn() {
      // this code is not needed
      // here for consistancy with other api mixins
      // might be able to connect to store
      return false;
    },

    async requestSignIn(form, graph=false) {

      if (graph) {

        graph.addGlyph('    |   ',        '    | ');
        graph.addGlyph(' [ SignIn ] .',  '.   + ---> (request) >','> [[[ SignIn Service ]]] ');
        graph.addGlyph('    |   ','    ',                '    | ');

      }

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
            data: aadData });
    },
    responseSignIn(response, graph=false) {
        this.statusSignIn = response.data.status;
        this.msgSignIn = response.data.msg;

        if (graph) {
          graph.addGlyph('    | ',           '    + <--- (token) <',  '<<< + ');
          graph.addGlyph('    | ',           '    | ');

        }
        switch(this.statusSignIn) {
         case '200':
           this.tokenSignIn = response.data.token;
           console.log('this.tokenSignIn ',this.tokenSignIn);
           break;
         case '404':
           // this.msgSignin = 'User not found!';
           console.error('User not found!');
           break;

         default:
           this.msgSignin = "Not sure what just happened!";
           console.error('Not sure what just happened!');
        }
        if (graph) {
          // graph.addGlyph('      | ',           '    + <--- (token) <',  '<<<< + ');
          // graph.addGlyph('      | ',           '    | ');

          // graph.addGlyph('    [ Authorize ] .', '  [ Set Current Token State ] ');
          // graph.addGlyph('      |   ','    | ');
          // graph.addGlyph('    [ = ] ','  [ = ] ');
        }

    }
  },
}
