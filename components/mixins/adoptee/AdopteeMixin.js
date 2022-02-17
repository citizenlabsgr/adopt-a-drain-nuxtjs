// import atob from 'atob';
// import { DW Handlers } from '@/components/mixins/DW Handlers.js'
// import { DatumDictionary } from '@/components/mixins/datum/DatumDictionary.js'

import { YoursDatum } from '@/components/mixins/datum/DatumYours.js'
import { OrphanDatum } from '@/components/mixins/datum/DatumOrphan.js'
import { AdopteeDatum } from '@/components/mixins/datum/DatumAdoptee.js'

export default {
  data () {
    return {
      name: 'Adoptee',
      my_adoptee_list: []
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
    ////////

    /*
    owner is the Adopter's identifier
    id is the Adoptee's identifier
    form is JSON
    */
    async adopteePut(owner,id,form) {
      if (this.graph) {
        this.addRequestService('PUT', 'Adoptee');
      }
      const aadHeader = this.aadHeaderUser;

      // const aadHeader = JSON.stringify(this.aadHeaderUser);
      const aadUrl = `${process.env.AAD_API_URL}/adoptee/${owner}/${id}`;
      const aadBody = JSON.stringify(form);

      return await this.$axios({
        url: aadUrl,
        method: 'put',
        headers: aadHeader,
        data: aadBody });
    }, // PUT

    adopteePutHandler(response) {
      if (this.graph) {
        this.addResponseService('PUT', 'Adoptee', 'response');
        this.addPassFail('Adoptee','400','404');
      }


      if (response.status === 200) {

        switch(response.data.status) {
          case '200':

            const id = response.data.updation.form['drain_id'];
            const data = JSON.parse(JSON.stringify(response.data.updation.form));
            const ownerKey = this.payload.key;
            // [ Add to Cache ]
            this.addDatum(new YoursDatum(id, data, ownerKey, this));
            // [ show on map]
            this.getDatum(id).show(this.map);

            break;
          case '400':
            console.log('adopteePutHandler 400');
            break;
          case '404':
            console.log('adopteePutHandler 404');
            console.log('You already have an account');
            break;
          default:
            console.error('Not sure what just happened');
        }

      }

    }, // PUT



    ////////////
    async adopteePost(owner, form) {

      if (this.graph) {
        this.addRequestService('POST', 'Adoptee');
      }

      const aadUrl = `${process.env.AAD_API_URL}/adoptee/${owner}`;
      const aadBody = form;
      const aadHeader = this.aadHeaderUser;

      return await this.$axios({
        url: aadUrl,
        method: 'post',
        headers: aadHeader,
        data: aadBody });
    }, // POST

    adopteePostHandler(response) {
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

    async adopteeGet(owner, id) {
      if (this.graph) {
        this.addRequestService('GET', 'Adoptee');
      }
      const aadUrl = `${process.env.AAD_API_URL}/adoptee/${owner}/${id}`;
      const aadHeader = this.aadHeaderGuest;

      return await this.$axios({
        url: aadUrl,
        method: 'get',
        headers: aadHeader});
    }, // GET
    adopteeGetHandler (response){
      if (this.graph) {
        this.addResponseService('GET', 'Adoptee', '[adoptee,...]');
        this.addPassFail('Adoptee','400','404');
      }
      if (response.status === 200) {
        switch(response.data.status) {
          case '200':
          console.log('adopteeGetHandler',response);
            //
            break;
          case '400':
            console.log('adopteeGetHandler 400');
            // console.log('You already have an account');
            break;
          case '404':
            console.log('adopteeGetHandler 404');
            // console.log('You already have an account');
            break;
          default:
            console.error('Not sure what just happened');
            // console.error('response', response.data);
        }
      } else {
        console.error('Whoa, I did not see that comming (%s)!'.replace('%s', response.status))
      }
    },

    async adopteeDelete(owner, id) {
      if (this.graph) {
        this.addRequestService('DELETE', 'Adoptee');
      }

      const aadUrl = `${process.env.AAD_API_URL}/adoptee/${owner}/${id}`;
      const aadHeader = this.aadHeaderUser;
      return await this.$axios({
        url: aadUrl,
        method: 'delete',
        headers: aadHeader});
    }, // DELETE

    adopteeDeleteHandler (response){
      if (this.graph) {
        this.addResponseService('DELETE', this.name, '(adoptee)');
        this.addPassFail('Adoptee','400','404');
      }
      if (response.status === 200) {
        switch(response.data.status) {
          case '200':
            // console.log('adopteeDeleteHandler 200 undefined')
            if (this.graph) {

              this.addGlyph(' [ Map ] ',' [ Mark Adoptee as Orphan ] ');
              this.addSpace();

            }

            let id = response.data.deletion.form.drain_id;
            let data = this.getDatum(id).getDataCopy();
            this.addDatum(new OrphanDatum(id, data, this));

            // console.log('adopteeDeleteHandler ',response.data.deletion.form.drain_id );
            // let id = response.data.deletion.form.drain_id;
            // this.getDatum(id).show(this.map);
            this.showSymbols();
            break;
          case '400':
            console.log('adopteeDeleteHandler 400 undefined')

            // console.log('You already have an account');
            break;
          case '404':
            console.log('adopteeDeleteHandler 404 undefined')

            // console.log('You already have an account');
            break;
          default:
            console.error('Not sure what just happened');
            // console.error('response', response.data);
        }
      } else {
        console.error('Whoa, I did not see that comming (%s)!'.replace('%s', response.status))
      }
    },

    async adopteeGetMBR(mbr) {
      if (this.graph) {
        this.addRequestService('GET', 'Adoptee');
      }
      // this.mbr = mbr;
      const aadUrl = `${process.env.AAD_API_URL}/adoptee/mbr`;
      const aadHeader = this.aadHeaderGuest;
      const aadData = JSON.parse(JSON.stringify(mbr));
      return await this.$axios({
        url: aadUrl,
        method: 'post',
        headers: aadHeader,
        data: aadData
      });
    },// GET MBR

    adopteeGetMBRHandler(response, mbr){
      if (this.graph) {
        //let d = this.getData(response);
        // let d = response.data.selection;
        // console.log('d ',d);
        let d =[ {pk:'xx',sk:'cc',tk:'cc',form:{},owner:'xx'}];
        this.addResponseService('GET', 'Adoptee', this.formatOutput(d));

        this.addPassFail('Adoptee','400','404');
      }

      if (response.status === 200) {
        switch(response.data.status) {
          case '200':
              if (!this.datumDictionary) {
                console.log('No datumDictionary');
              }

                const aadAuthentecated = this.isAuthenticated;
                let dr = {};
                for (dr in response.data.selection) {

                    let id=response.data.selection[dr].form.drain_id;
                    let data=response.data.selection[dr].form;
                    let ownerKey=response.data.selection[dr].owner;
                    // let isYours = (this.payload.key !== '0' && this.payload.key === datum.getKey());

                    let datum = false;
                    if (aadAuthentecated) {
                        if (this.payload.key === ownerKey) {
                            // this one has been adopted by you
                            datum = new YoursDatum(id, data, ownerKey, this);
                        } else {
                            datum = new AdopteeDatum(id, data, ownerKey,this);
                        }
                    } else {
                        datum = new AdopteeDatum(id, data, ownerKey,this);
                    }

                    if (this.datumDictionary) {

                      this.addDatum(datum); // this drain is not on the map yet

                      this.cleanDatumCache(mbr);

                    }

                    // AAD Handlers_cnt++
                } // for
                //////////////
                // Prepare to load orphans
                ///////

                if (this.graph) {
                  if (this.datumDictionary) {
                    this.addGlyph(this.down, ` [ Processed ${this.datumDictionary.datumCount()} Datum ] `);
                  }
                }
            break;
          case '400':
            // console.log('You already have an account');
            break;
          case '404':
            // console.log('You already have an account');
            break;
          default:
            console.error('Not sure what just happened ', response.data.status);
        }
      } else {
        console.error('Whoa, I did not see that comming (%s)!'.replace('%s', response.status))
      }
    },
    /*
    async adopteeGetMy(owner) {
      if (graph) {
        this.addRequestService('GET', 'Adoptee');
      }
      const aadUrl = `${process.env.AAD_API_URL}/adoptee/${owner}`;
      const aadHeader = this.aadHeader;
      const aadData = JSON.parse(JSON.stringify(mbr));
      return await this.$axios({
        url: aadUrl,
        method: 'post',
        headers: aadHeader,
        data: aadData
      });
    },// GET My
    */
    async adopteeGetMy(owner) {
      if (this.graph) {
        this.addRequestService('GET', 'Adoptee');
      }
      const aadUrl = `${process.env.AAD_API_URL}/adoptee/${owner}`;
      const aadHeader = this.aadHeaderUser;
      return await this.$axios({
        url: aadUrl,
        method: 'get',
        headers: aadHeader});
    }, // GET
    adopteeGetMyHandler (response){
      if (this.graph) {
        this.addResponseService('GET', 'Adoptee', '[adoptee,...]');
        this.addPassFail('Adoptee','400','404');
      }
      if (response.status === 200) {
        switch(response.data.status) {
          case '200':
            // console.log('adopteeGetMyHandler',response);
            let save = false;
            if (this.my_adoptee_list) {
              save = true;
              this.my_adoptee_list.length = 0;
            }
            for (let i in response.data.selection) {
                if (save) {
                    this.my_adoptee_list.push(response.data.selection[i].form);
                }
            }
            break;
          case '400':
            console.log('adopteeGetHandler 400');
            // console.log('You already have an account');
            break;
          case '404':
            console.log('adopteeGetHandler 404');
            // console.log('You already have an account');
            break;
          default:
            console.error('Not sure what just happened');
            // console.error('response', response.data);
        }
      } else {
        console.error('Whoa, I did not see that comming (%s)!'.replace('%s', response.status))
      }
    },
    /*
       upsert
       owner is the owner identity value
       id is '0' or identity value
       formContainer is object/class wrapper that has id and data
    */
    upsertAdpptee(token, owner, id, formContainer) {

        if (!formContainer.data) {
            throw new Error('Object must contain data attribute!');
        }
        if (!formContainer.id) {
            throw new Error('Object must contain id attribute!');
        }
        if (id === '0') {
            this.insertAdpt(token, owner, formContainer);
        } else {
            this.updateAdpt(token, owner, id, formContainer);
        }
    },
  },
}
