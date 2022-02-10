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
      aadHeader: {
        "Accept":"application/json",
        'Authorization': `Bearer ${process.env.AAD_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      my_adoptee_list: [],
      mbr: null
      // datumDictionary: new DatumDictionary()
    };
  },
  methods: {
    ////////
    async aadAdopteePutRequest(owner,id,form) {
      if (this.graph) {
        this.addRequestService('PUT', 'Adoptee');
      }

      const aadHeader = JSON.stringify(this.aadHeader);
      aadHeader.authorization = `Bearer ${this.current_token}`;
      const aadUrl = `/adoptee/${owner}/${id}`;
      const response = await this.$axios({
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
            // console.log('Thanks for the update');
            if (this.payload.user !== response.data.updation.form.username) {
              // console.log('Force logout');
              this.$store.commit('detoken');
              // this.$router.push('authenticate');
            }
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
    async aadAdopteePost(form) {
      if (this.graph) {
        this.addRequestService('POST', 'Adoptee');
      }
      const aadUrl = process.env.AAD_API_URL + '/adoptee';
      const aadBody = form;
      const aadHeader = this.aadHeader;
      return await this.$axios({
        url: aadUrl,
        method: 'post',
        headers: aadHeader,
        data: aadBody });
    }, // POST
    aadAdopteePostHandler(response) {
        this.statusAdoptee = response.data.status;
        this.msgAdoptee = response.data.msg;
        if (this.graph) {
          this.addResponseService('POST', 'Adoptee', '[adoptee,...]');
          this.addPassFail('Adoptee','400','404','409');
        }

        if (response.status === 200) {
          switch(response.data.status) {
            case '200':
                // console.log('aadAdopteePostHandler 200 undefined')

                const id = response.data.insertion.form['drain_id'];
                const data = JSON.parse(JSON.stringify(response.data.insertion.form));
                const ownerKey = this.payload.key;

                // [ Add to Cache ]
                this.setDatum(new YoursDatum(id, data, ownerKey, this));
                // [ show on map]
                this.getDatum(id).show(this.map);

                if (this.graph) {
                  this.addGlyph(' [ Map ] ',     ' [ Mark Drain as Yours ] ');
                  this.addSpace();
                  this.addGlyph(this.down,     ' [ Show Drains ] ');

                  this.addSpace();
                  this.addEnd();
                  // console.log(this.get Graph());
                  this.showGraph();
                }
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
      const aadHeader = this.aadHeader;
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
        this.addSpace();
        this.addGlyph(this.down,  '   + ---> (DELETE) >','> [[ Adoptee Service ]] ');
        this.addGlyph(this.down,' ', this.down);
      }
      const aadUrl = `${process.env.AAD_API_URL}/adoptee/${owner}/${id}`;
      const aadHeader = this.aadHeader;
      return await this.$axios({
        url: aadUrl,
        method: 'get',
        headers: aadHeader});
    }, // DELETE
    aadAdopteeDeleteHandler (response){
      if (this.graph) {
        this.addResponseService('DELETE', this.name, '[adoptee,...]');
        this.addPassFail('Adoptee','400','404');
      }
      if (response.status === 200) {
        switch(response.data.status) {
          case '200':
            console.log('aadAdopteeDeleteHandler 200 undefined')
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
      this.mbr = mbr;
      const aadUrl = `${process.env.AAD_API_URL}/adoptee/mbr`;
      const aadHeader = this.aadHeader;
      const aadData = JSON.parse(JSON.stringify(mbr));
      return await this.$axios({
        url: aadUrl,
        method: 'post',
        headers: aadHeader,
        data: aadData
      });
    },// GET MBR
    //     aadAdopteeGetMBRHandler (response, mbr){
    aadAdopteeGetMBRHandler (response){
      // console.log('aadAdopteeGetMBRHandler 1');
      if (this.graph) {
        this.addResponseService('GET', 'Adoptee', '[adoptee,...]');
        this.addPassFail('Adoptee','400','404');
      }

      if (response.status === 200) {
        switch(response.data.status) {
          case '200':
              // console.log('aadAdopteeGetMBRHandler 2');
              if (!this.datumDictionary) {
                console.log('No datumDictionary');
              }
              // console.log('aadAdopteeGetMBRHandler 3');

                const aadAuthentecated = this.isAuthenticated;
                let dr = {};
                for (dr in response.data.selection) {
                  // console.log('aadAdopteeGetMBRHandler 4');

                    let id=response.data.selection[dr].form.drain_id;
                    let data=response.data.selection[dr].form;
                    let ownerKey=response.data.selection[dr].owner;
                    // let isYours = (this.payload.key !== '0' && this.payload.key === datum.getKey());
                    // console.log('aadAdopteeGetMBRHandler 5');

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
                    // console.log('aadAdopteeGetMBRHandler 6');

                    if (this.datumDictionary) {
                      // console.log('aadAdopteeGetMBRHandler 6.1');

                      this.addDatum(datum); // this drain is not on the map yet
                      // console.log('aadAdopteeGetMBRHandler 6.2');
                      // console.log('mbr ', this.mbr)
                      
                      this.cleanDatumCache(this.mbr);

                      // console.log('aadAdopteeGetMBRHandler 6.3');
                    
                    }
                    // console.log('aadAdopteeGetMBRHandler 7');

                    // AADHandlers_cnt++
                } // for
                //////////////
                // Prepare to load orphans
                ///////
                // console.log('aadAdopteeGetMBRHandler 8');

                if (this.graph) {
                  // console.log('aadAdopteeGetMBRHandler 4', ` [ Processed ${this.datumDictionary.datumCount()} Datum ] `);
                  if (this.datumDictionary) {
                    this.addGlyph(this.down, ` [ Processed ${this.datumDictionary.datumCount()} Datum ] `);
                  } 
                }
               //  console.log('aadAdopteeGetMBRHandler out');
            break;
          case '400':
            // console.log('aadAdopteeGetMBRHandler 400');
            // console.log('You already have an account');
            break;
          case '404':
            // console.log('aadAdopteeGetMBRHandler 404 ');
            // console.log('You already have an account');
            break;
          default:
            console.error('Not sure what just happened ', response.data.status);
            // console.error('response', response.data);
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
      const aadHeader = this.aadHeader;
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
