import { RequestAdopter } from '@/components/mixins/adopter/RequestAdopter.js';
import { ResponseAdopter } from '@/components/mixins/adopter/ResponseAdopter.js';

export default {
  data () {
    return {
      name: 'Adopter'
    };
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
      return {
        "Accept":"application/json",
        'Authorization': `Bearer ${this.current_token}`,
        'Content-Type': 'application/json'
      }
    },
  },
  methods: {

    loadAdopter() {
      if (!this.isAuthenticated) { return; }
      this.loadTOU();

      const owner = this.payload.key;
      const id = this.payload.user;
      const aadUrl = `${process.env.AAD_API_URL}/adopter/${owner}/${id}`;

      new RequestAdopter(this).Get(owner,id)
        .then((response) => {

          const responseRest = new ResponseAdopter(this);

          let s = responseRest.handler(response);

          switch (s) {
            case '200':
                if (this.graph) {
                    this.addGlyph(' [ Display ] ', ' [ Refresh Adopter Fields ] ');
                    this.addSpace();
                }
                this.form.displayname = response.data.selection[0].form.displayname;
                this.form.username = response.data.selection[0].form.username;
                this.form.password = '';
              this.setFeedback('Ok');
              break;
            case '400':
              this.setFeedback('Bad Request');
              break;
            case '404':
              this.setFeedback('Not Found');
              break;
            default:
              // console.log('Unhandled response status ');
              this.addError(`Unhandled response status ${s}`);
          }

          this.addSpace();
          this.addEnd();
          this.showGraph();
          
        })
        .catch((err) => {

          console.error('Something unexpected happened (%s)!'.replace('%s', err))
        });
        
    },

    upsert(owner, id, form) {
      // console.log('[upsert]');
      // insert
      if (id === '0') {
         // console.log('  (form) -->');
         this.addAdopter(form);
      } else if (id !== '0') { // update
         // id is the original id not one based on form changes
         this.updateAdopter(owner, id, form);
      }
    },

    addAdopter(form) { // ('signup', aadHeader, form)

      new RequestAdopter(this).Post(form)
        .then((response) => {

          const responseRest = new ResponseAdopter(this);
          // console.log('responseRest.name ',responseRest.name);
          let s = responseRest.handler(response);
          switch (s) {
            case '200':
              this.setFeedback('Welcome ');
              break;
            case '409':
              this.setFeedback('User already exists!');
              break;
            default:
              console.log('Unhandled response status ');
              this.addError(`Unhandled response status ${s}`);
          }

          this.addSpace();
          this.addEnd();
          this.showGraph();
        })
        .catch((err) => {
          console.error('xSomething unexpected happened (%s)!'.replace('%s', err))
        })

    },
    updateAdopter(owner, id, form) {

      new RequestAdopter(this).Put(owner, id, form)
        .then((response) => {
          console.log('updateAdopter FixMe ');
          const responseRest = new ResponseAdopter(this);
          let s = responseRest.handler(response);
          switch (s) {
            case '200':
              this.setFeedback('Welcome Back');
              break;
            case '400':
              this.setFeedback('Bad Request');
              break;
            case '404':
              this.setFeedback('Not Found');
              break;
            default:
              console.log('Unhandled response status ');
              this.addError(`Unhandled response status ${s}`);
          }

          this.addSpace();
          this.addEnd();
          this.showGraph();
        })
        .catch((err) => {
          console.error('xSomething unexpected happened (%s)!'.replace('%s', err))
        })
          /*
          // new ResponseAdopter(this).Put(response);
          this.adopterPostHandler(response);
          if (response.status === 200) {

            switch(response.data.status) {
              case '200':
                // console.log('Thanks for the update');

                if (this.payload.user !== response.data.updation.form.username) {

                  this.$store.commit('detoken');
                  this.$router.push('authenticate');
                }
                break;
              case '409':
                console.log('You already have an account');
                break;
              default:
                console.error('Not sure what just happened');
            }
          } else {
            console.error('Whoa, I did not see that comming (%s)!'.replace('%s', response.status));
          }
        })
        .catch((err) => {
          // console.error('put adopter 2 aadUrl', aadUrl);
          // console.error('put adopter 2 aadHeader', aadHeader);
          // console.error('put adopter 2 form', form);
          console.error('Something unexpected happened (%s)!'.replace('%s', err));
        })
        */

    }

    /*
    adopterPostHandler(response) {
        if (!this.datumDictionary) {
          throw new Error('datumDictionary not found');
        }
        this.statusAdoptee = response.data.status;
        this.msgAdoptee = response.data.msg;
        if (this.graph) {
          this.addResponseService('POST', 'Adoptee', '[adoptee,...]');
          this.addPassFail('Adoptee','400','404','409');
        }

        if (response.status === 200) {
          switch(response.data.status) {
            case '200':

                const id = response.data.insertion.form['drain_id'];
                const data = JSON.parse(JSON.stringify(response.data.insertion.form));
                const ownerKey = this.payload.key;

                // [ Add to Cache ]
                this.addDatum(new YoursDatum(id, data, ownerKey, this));
                // [ show on map]
                this.getDatum(id).show(this.map);

                if (this.graph) {
                  this.addGlyph(' [ Map ] ',     ' [ Mark Drain as Yours ] ');
                  this.addSpace();
                }
                this.showSymbols();
              break;
            case '400':
            console.log('adopteePostHandler 400 undefined')

              break;
            case '404':
            console.log('adopteePostHandler 404 undefined')

              break;
            default:
              console.error('Not sure what just happened');
              // console.error('response', response.data);
          }
        } else {
          console.error('Whoa, I did not see that comming (%s)!'.replace('%s', response.status))
        }

    },// POST
    */


  },
}
