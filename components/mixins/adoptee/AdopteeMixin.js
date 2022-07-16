
import { YoursDatum } from '@/components/mixins/datum/DatumYours.js'
import { OrphanDatum } from '@/components/mixins/datum/DatumOrphan.js'
import { AdopteeDatum } from '@/components/mixins/datum/DatumAdoptee.js'
import { ResponseHelper } from "../ResponseHelper";

export default {
  data () {
    return {
      name: "Adoptee",
      mbr: {
          north: 0.0,
          south: 0.0,
          east: 0.0,
          west: 0.0
      },
      service: {
        status: 900,
        adopteeGetOwnerRequest: {
          request: {
            "owner": ""
          },
          response: [
            {
              "pk":"drain_id#cgr_2736",
              "sk":"const#ADOPTEE",
              "tk":"guid#92c9c50c-d339-44d6-9706-c0c10b731d0d",
              "form":{"lat":42.9639737043,
                      "lon":-85.66837114350001,
                      "name":"a",
                      "type":"orphan",
                      "drain_id":"CGR_2736"},
              "owner":"f084c2f8-a4b0-4c61-9a4a-28c4a8327dd0",
              "active":true,
              "created":"2022-06-19T11:55:08.395594",
              "updated":"2022-06-19T11:55:08.395594"
             }
           ]
        },  
        adopteeGetMBRRequest: {
          request: {
            mbr: {
              north: 0.0,
              south: 0.0,
              east: 0.0,
              west: 0.0
            }
          },
          response: [
            {"pk":"drain_id#cgr_2736",
             "sk":"const#ADOPTEE",
             "tk":"guid#92c9c50c-d339-44d6-9706-c0c10b731d0d",
             "form":{"lat":42.9639737043,
                     "lon":-85.66837114350001,
                     "name":"a",
                     "type":"orphan",
                     "drain_id":"CGR_2736"},
             "owner":"f084c2f8-a4b0-4c61-9a4a-28c4a8327dd0",
             "active":true,
             "created":"2022-06-19T11:55:08.395594",
             "updated":"2022-06-19T11:55:08.395594"
           }
           ],
          store: {
               stub: ""         
          }
        },
        adopteeGetRequest:{
          request: {
              "owner": "",
              "id": ""
          }
        },
        adopteePostRequest:{
          request: {
              "owner": "",
              "id": "",
              "form": {"stub":""}
          }
        },
        adopteePutRequest:{
          request: {
              "owner": "",
              "id": "",
              "form": {"stub":""}
          }
        },
        adopteeMBR: {
          get: {  
            input: {
              mbr: {
                  north: 0.0,
                  south: 0.0,
                  east: 0.0,
                  west: 0.0
              }
            },
            response: [
                       {"pk":"drain_id#cgr_2736",
                        "sk":"const#ADOPTEE",
                        "tk":"guid#92c9c50c-d339-44d6-9706-c0c10b731d0d",
                        "form":{"lat":42.9639737043,
                                "lon":-85.66837114350001,
                                "name":"a",
                                "type":"orphan",
                                "drain_id":"CGR_2736"},
                        "owner":"f084c2f8-a4b0-4c61-9a4a-28c4a8327dd0",
                        "active":true,
                        "created":"2022-06-19T11:55:08.395594",
                        "updated":"2022-06-19T11:55:08.395594"
                      }
                      ],
            mapping: {
              "lat":["0","form","lat"],
              "lon":["0","form","lon"],
              "name":["0","form","name"],
              "type":["0","form","type"],
              "drain_id":["0","form","drain_id"]
            },
            depoutput: {
              "adopteeList": [
                {"lat":42.9639737043,
                 "lon":-85.66837114350001,
                 "name":"a",
                 "type":"orphan",
                 "drain_id":"CGR_2736"}
              ]
            }
          }  
        },
        adoptee: {
          get: {
            request: {
              owner: 0.0,
              id: 0.0
            },
            response: {
              "tbd":"tbd"
            },
            mapping: {
              "tbd":"tbd"

            },
            output: {
              "tbd":"tbd"
            }
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
      return {
        "Accept":"application/json",
        'Authorization': `Bearer ${this.current_token}`,
        'Content-Type': 'application/json'
      }
    },
  },
  methods: {
    getAdopteeMapping(method='GET') {
      let rc=null;
      if (method === 'GET') {
        rc = this.service.adoptee.get.mapping;
      }
      return rc;
    },
    
    /*
    owner is the Adopter's identifier
    id is the Adoptee's identifier
    form is JSON
    */
    async adopteeGetOwnerRequest(owner) {
      // existing adoptees
      // list of owners adoptees
      // /adoptee/owner
    
      const aadUrl = `${process.env.AAD_API_URL}/adoptee/${owner}`;
      
      const aadHeader = this.aadHeaderUser;
      
      // return await this.get(url, headers);
      return await this.$axios({
        url: aadUrl,
        method: 'get',
        headers: aadHeader});
    },
    async adopteeGetRequest(owner, id) {
      
      const aadUrl = `${process.env.AAD_API_URL}/adoptee/${owner}/${id}`;
      const aadHeader = this.aadHeaderGuest;

      return await this.$axios({
        url: aadUrl,
        method: 'get',
        headers: aadHeader});
    }, // GET
    /*
    adopteeGetHandler (response){
      // if (this.graph) {
      //   this.addResponseService('GET', 'Adoptee', '[adoptee,...]');
      //   this.addPassFail('Adoptee','400','404');
      // }
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
    */

    async adopteeGetMBRRequest(mbr) {

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
      let handler = new ResponseHelper(response);
      // console.log('adopteeGetMBRHandler response ', response);
      if (response.status === 200) { // remove 
        switch(handler.status()) {
          case '200':
            // console.log('adopteeGetMBRHandler 2');
              // check to verify shared storage is available
              if (!this.datumDictionary) {
                console.log('No datumDictionary');
              }
              // console.log('adopteeGetMBRHandler 3');

                const aadAuthentecated = this.isAuthenticated;
                let dr = {};
                // console.log('adopteeGetMBRHandler 4 ', handler.data());

                // for (dr in response.data.selection) {
                for (dr in handler.data()) {
                    // console.log('adopteeGetMBRHandler 4.1 dr',dr); 
                    let id=handler.data()[dr].form.drain_id;
                    let data=handler.data()[dr].form;
                    let ownerKey=handler.data()[dr].owner;
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
                    
                    // check to verify shared storage is available

                    if (this.datumDictionary) {
                      // save in shared storage
                      this.addDatum(datum); // this drain is not on the map yet
                      // weed out the drains beyond the visible
                      this.cleanDatumCache(mbr);

                    }

                    // AAD Handlers_cnt++
                } // for
                //////////////
                // Prepare to load orphans
                ///////

               
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
    // async adopteePut(owner,id,form) {

    async adopteePutRequest(owner,id,form) {
      // if (this.graph) {
      //   this.addRequestService('PUT', 'Adoptee');
      // }
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
      // if (this.graph) {
      //   this.addResponseService('PUT', 'Adoptee', 'response');
      //   this.addPassFail('Adoptee','400','404');
      // }


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
    async adopteePostRequest(owner, form) {

      // if (this.graph) {
      //   this.addRequestService('POST', 'Adoptee');
      // }

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
        // if (this.graph) {
        //  this.addResponseService('POST', 'Adoptee', '[adoptee,...]');
        //  this.addPassFail('Adoptee','400','404','409');
        // }

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

                // if (this.graph) {
                //  this.addGlyph(' [ Map ] ',     ' [ Mark Drain as Yours ] ');
                //  this.addSpace();
                // }
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

    
    async adopteeDelete(owner, id) {
      // if (this.graph) {
      //   this.addRequestService('DELETE', 'Adoptee');
      // }

      const aadUrl = `${process.env.AAD_API_URL}/adoptee/${owner}/${id}`;
      const aadHeader = this.aadHeaderUser;
      return await this.$axios({
        url: aadUrl,
        method: 'delete',
        headers: aadHeader});
    }, // DELETE

    adopteeDeleteHandler (response){
      // if (this.graph) {
      //   this.addResponseService('DELETE', this.name, '(adoptee)');
      //   this.addPassFail('Adoptee','400','404');
      // }
      if (response.status === 200) {
        switch(response.data.status) {
          case '200':
            // console.log('adopteeDeleteHandler 200 undefined')
            // if (this.graph) {

            //  this.addGlyph(' [ Map ] ',' [ Mark Adoptee as Orphan ] ');
            //  this.addSpace();

            // }

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
    }
  }
}