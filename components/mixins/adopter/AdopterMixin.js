// import { RequestAdopter } from '@/components/mixins/adopter/RequestAdopter.js';
// import { ResponseAdopter } from '@/components/mixins/adopter/ResponseAdopter.js';
import { ResponseHelper } from '@/components/mixins/ResponseHelper.js';


export default {
  data () {
    return {
      name: "Adopter",
      // storage for response
      mxForm: {
        displayname:"",
        username:"",
        password:""
      },

      feedback: "",
      service: {
        adopterGetRequest: {
          request: {
            "owner": "",
            "id": ""
          },
          response: {
            "data": [{
                "active": true,
                "created": "",
                "form": {
                  "displayname":"",
                  "scope":"",
                  "username":""
                },
                "owner": "",
                "pk": "",
                "sk":"",
                "tk": "",
                "updated": ""
              }
            ]
          },
          mapping: {
            "displayname": "data.0.form.displayname",
            "username": "data.0.form.username"
          },
          output: {
            "displayname": "",
            "username":""
          }
        },
        adopterPutRequest: {
          request: {
            "owner": "",
            "id": "",
            "form": {
              "displayname":"",
              "username":""
            }
          },
          response: {
            "active": true,
            "created": "2022-07-12T18:48:51.485386",
            "form": {
              "scope": "api_user",
              "username": "j@citizenlabs.org",
              "displayname": "aax"
            },
            "owner": "44effb7e-0946-4bde-a00d-74d669b1d1e8",
            "pk": "username#j@citizenlabs.org",
            "sk": "const#USER",
            "tk": "guid#44effb7e-0946-4bde-a00d-74d669b1d1e8",
            "updated": "2022-07-12T19:40:39.372079"
          }
        },
        adopterPostRequest: {
          request: {
            "form": {
              "displayname":"",
              "username":"",
              "password":""
            }
          },
          response: {
            "active": true,
            "created": "2022-07-12T20:00:22.234527",
            "form": {
              "scope": "api_user",
              "username": "c@citizenlabs.org",
              "displayname": "a"
            },
            "owner": "92529cc6-e687-4326-9c6c-c59583ceeece",
            "pk": "username#c@citizenlabs.org",
            "sk": "const#USER",
            "tk": "guid#92529cc6-e687-4326-9c6c-c59583ceeece",
            "updated": "2022-07-12T20:00:22.234527"
          }
        },
        adopterDeleteRequest: {
          request: {
            "owner": "",
            "id": ""
          },
          response: {
            "TBD":"TBD"
          }
        }
      }
    }
  },

  computed: {
    aadHeaderGuest () {
      return {
        "Accept":"application/json",
        'Authorization': `Bearer ${process.env.AAD_API_TOKEN}`,
        'Content-Type': 'application/json'
      };
    },
    aadHeaderUser() {
      // console.log('aadHeaderUser this.current_token ',this.current_token);
      let rc =  {
        "Accept":"application/json",
        'Authorization': `Bearer ${this.current_token}`,
        'Content-Type': 'application/json'
      };
      // console.log('aadHeaderUser rc ',rc);
      return rc;
    },
  },


  methods: {
    getFeedback() {
      return this.feedback;
    },

    setFeedback(msg) {
      this.feedback = msg;
    },

    // getAdopterWarning() {
    //   return this.mxWarning;
    // },

    adopterTransferGetData(to) {
      to.displayname = this.mxForm.displayname;
      to.username = this.mxForm.username;
      to.password = this.mxForm.password;
    },
    /*
            _             _             _____      _
           | |           | |           / ____|    | |
   __ _  __| | ___  _ __ | |_ ___ _ __| |  __  ___| |_
  / _` |/ _` |/ _ \| '_ \| __/ _ \ '__| | |_ |/ _ \ __|
 | (_| | (_| | (_) | |_) | ||  __/ |  | |__| |  __/ |_
  \__,_|\__,_|\___/| .__/ \__\___|_|   \_____|\___|\__|
                   | |
                   |_|
    */

    async adopterGetRequest(owner, id) { // replaces loadAdopter
      console.log('');
      const url = `${process.env.AAD_API_URL}/adopter/${owner}/${id}`;
      const headers = this.aadHeaderUser;
      return await this.$axios({
        url: url,
        method: 'get',
        headers: headers});
    },

    adopterGetHandler(response) {
      // console.log('adopterGetHandler 1', response);

      const helper = new ResponseHelper(response);
      let status = helper.status(); // this.response.data.status;
      let msg = helper.msg();
      // console.log('adopterGetHandler 2 status ', status);

      switch (status) {
            case '200':

                this.mxForm.displayname = response.data.selection[0].form.displayname;
                this.mxForm.username = response.data.selection[0].form.username;
                this.mxForm.password = '';

                this.setFeedback(`Status: ${msg}`);

              break;

            default:
                console.error(`adopterGetHandler Status: ${status} ${msg}`);
                this.setFeedback(`Status: ${msg}`);
                // this.mxWarning=`Unhandled response status ${status}`;
          }
    },
    /*
            _             _            _____          _
           | |           | |          |  __ \        | |
   __ _  __| | ___  _ __ | |_ ___ _ __| |__) |__  ___| |_
  / _` |/ _` |/ _ \| '_ \| __/ _ \ '__|  ___/ _ \/ __| __|
 | (_| | (_| | (_) | |_) | ||  __/ |  | |  | (_) \__ \ |_
  \__,_|\__,_|\___/| .__/ \__\___|_|  |_|   \___/|___/\__|
                   | |
                   |_|
    */
    async adopterPostRequest (form) { // aka SignUp
      // console.log('adopterPostRequest 1');
      const url = `${process.env.AAD_API_URL}/signup`;
      const headers = this.aadHeaderGuest;
      const data = form;

      // New Adopter aka user
      //return await this.post(url,headers,data);
      return await this.$axios({
        url: url,
        method: 'post',
        headers: headers,
        data: data
      });
    },

    adopterPostHandler(response) {
      // console.log('adopterPostHandler 1');
      // console.log('response', response);
      const helper = new ResponseHelper(response);
      let status = helper.status(); // this.response.data.status;
      let msg = helper.msg();
      // console.log('adopterPostHandler data ', helper.data());
      switch (status) {
        case '200':
            // console.log(helper.data());
            this.setFeedback(`Status: ${msg}`);
          break;

        default:
            console.error(`adopterPostHandler Status: ${status} ${msg}`);
            this.setFeedback(`Status: ${msg}`);
            // this.mxWarning=`Unhandled response status ${status}`;
      }
    },

   /*
            _             _            _____       _
           | |           | |          |  __ \     | |
   __ _  __| | ___  _ __ | |_ ___ _ __| |__) |   _| |_
  / _` |/ _` |/ _ \| '_ \| __/ _ \ '__|  ___/ | | | __|
 | (_| | (_| | (_) | |_) | ||  __/ |  | |   | |_| | |_
  \__,_|\__,_|\___/| .__/ \__\___|_|  |_|    \__,_|\__|
                   | |
                   |_|
   */
    async adopterPutRequest (owner, id, form) {
      // owner is the owner
      // id is user email
      // do not send password
      // |(owner, id, form(displayname,scope,username))|:
      // [adopterPutRequest]:
      // |(active,created,form(displayname,scope,username),owner,pk,tk,updated)|:
      // console.log('adopterPutRequest 1');


      const url = `${process.env.AAD_API_URL}/adopter/${owner}/${id}`;
      const headers = this.aadHeaderUser;
      const data = form;
      delete data['password'];

      return await this.$axios({
        url: url,
        method: 'put',
        headers: headers,
        data: data
      });
    },

    adopterPutHandler(response) {
      // console.log('adopterPutHandler 1');

      const helper = new ResponseHelper(response);
      let status = helper.status(); // this.response.data.status;
      let msg = helper.msg();
      // console.log('adopterPutHandler data', helper.data());
      switch (status) {
        case '200':
            this.setFeedback(`Status: ${msg}`);
          break;

        default:
            console.error(`adopterPutHandler Status: ${status} ${msg}`);
            this.setFeedback(`Status: ${msg}`);
            // this.mxWarning=`Unhandled response status ${status}`;
      }
    },

   /*
            _             _            _____       _      _
           | |           | |          |  __ \     | |    | |
   __ _  __| | ___  _ __ | |_ ___ _ __| |  | | ___| | ___| |_ ___
  / _` |/ _` |/ _ \| '_ \| __/ _ \ '__| |  | |/ _ \ |/ _ \ __/ _ \
 | (_| | (_| | (_) | |_) | ||  __/ |  | |__| |  __/ |  __/ ||  __/
  \__,_|\__,_|\___/| .__/ \__\___|_|  |_____/ \___|_|\___|\__\___|
                   | |
                   |_|
   */

  }
}
