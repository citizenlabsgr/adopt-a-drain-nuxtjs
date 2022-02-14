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
    async aadAdopteePutRequest(owner,id,form) {
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

    aadAdopteePutHandler(response) {
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
            console.log('aadAdopteePutHandler 400');
            break;
          case '404':
            console.log('aadAdopteePutHandler 404');
            console.log('You already have an account');
            break;
          default:
            console.error('Not sure what just happened');
        }

      }

    }, // PUT



    ////////////
    async aadAdopteePost(owner, form) {
      
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

    aadAdopteePostHandler(response) {
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
            console.log('aadAdopteePostHandler 400 undefined')

              break;
            case '404':
            console.log('aadAdopteePostHandler 404 undefined')

              break;
            default:
              console.error('Not sure what just happened');
              // console.error('response', response.data);
          }
        } else {
          console.error('Whoa, I did not see that comming (%s)!'.replace('%s', response.status))
        }

    },// POST

    async aadAdopteeGet(owner, id) {
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
    aadAdopteeGetHandler (response){
      if (this.graph) {
        this.addResponseService('GET', 'Adoptee', '[adoptee,...]');
        this.addPassFail('Adoptee','400','404');
      }
      if (response.status === 200) {
        switch(response.data.status) {
          case '200':
          console.log('aadAdopteeGetHandler',response);
            //
            break;
          case '400':
            console.log('aadAdopteeGetHandler 400');
            // console.log('You already have an account');
            break;
          case '404':
            console.log('aadAdopteeGetHandler 404');
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

    async aadAdopteeDelete(owner, id) {
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
    aadAdopteeDeleteHandler (response){
      if (this.graph) {
        this.addResponseService('DELETE', this.name, '(adoptee)');
        this.addPassFail('Adoptee','400','404');
      }
      if (response.status === 200) {
        switch(response.data.status) {
          case '200':
            // console.log('aadAdopteeDeleteHandler 200 undefined')
            if (this.graph) {

              this.addGlyph(' [ Map ] ',' [ Mark Adoptee as Orphan ] ');
              this.addSpace();

            }
            // console.log('aadAdopteeDeleteHandler ',response.data.deletion.form.drain_id );
            // let id = response.data.deletion.form.drain_id;
            // this.getDatum(id).show(this.map);
            this.showSymbols();
            break;
          case '400':
            console.log('aadAdopteeDeleteHandler 400 undefined')

            // console.log('You already have an account');
            break;
          case '404':
            console.log('aadAdopteeDeleteHandler 404 undefined')

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

    async aadAdopteeGetMBR(mbr) {
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
    
    aadAdopteeGetMBRHandler(response, mbr){
      if (this.graph) {
        this.addResponseService('GET', 'Adoptee', this.formatOutput(response.data.selection));
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

                    // AADHandlers_cnt++
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
    async aadAdopteeGetMy(owner) {
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
    async aadAdopteeGetMy(owner) {
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
    aadAdopteeGetMyHandler (response){
      if (this.graph) {
        this.addResponseService('GET', 'Adoptee', '[adoptee,...]');
        this.addPassFail('Adoptee','400','404');
      }
      if (response.status === 200) {
        switch(response.data.status) {
          case '200':
            // console.log('aadAdopteeGetMyHandler',response);
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
            console.log('aadAdopteeGetHandler 400');
            // console.log('You already have an account');
            break;
          case '404':
            console.log('aadAdopteeGetHandler 404');
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
