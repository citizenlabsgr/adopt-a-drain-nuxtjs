// namespace prefix Adoptee is Adpt
// import { AAD Handlers } from '@/components/mixins/AAD Handlers.js'
import { DrainTypes } from '@/components/mixins/drain/DrainTypes.js'
import { MapHelper } from '@/components/mixins/map/MapHelper.js'
import { InfoHelper } from '@/components/mixins/map/InfoHelper.js'
// import { DW Handlers } from '@/components/mixins/DW Handlers.js'
import  Graph   from '@/components/mixins/graph/graph.js'

// import { Datum } from './Datum'
import { OrphanDatum } from '@/components/mixins/datum/DatumOrphan'
import { AdopteeDatum } from '@/components/mixins/datum/DatumAdoptee'
import { YoursDatum } from '@/components/mixins/datum/DatumYours'
import  DrainMixin   from '@/components/mixins/drain/DrainMixin.js'

/*
to use load
*/
export default {
  data () {
    return {
      name: 'Adoptee',
       // local_dictionary: { }, // you, I will kill last.
        // marker_dict ionary: {},
        lastResult: {},
        max_center_box_area: 0.00005,
        view_box: {},
        delay: 20,
        counter: 0,
        info_window: null,
        // map: null,
        // my_adoptee_list: []
        // adptGraph: new Graph(), // deprecate graph
        aadHeader: {
        "Accept":"application/json",
        'Authorization': `Bearer ${process.env.AAD_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  },

  methods: {
   /*
    depgetDataCount() {
        return Object.keys(this.marker_ dictionary).length;
    },
    */
   /*
    getDataAdpt() {
        return this.marker_d ictionary;
    },
    */
    /*
    setDatumAdpt(datum) {
        // formContainer could be drain but doesnt have to be
        // never let drains with map stuff attached get loaded
        // dont overwrite existing drains those may have map info, image, and ...

        if (!datum || !datum.data) {
            throw new Error('Object missing data attribute!');
        }
        // if (this.marker_ dictionary[datum.getId()]) { // replace old
        if (!this.getDatumAdpt(datum.getId())) {
            // add marker when not available
            this.marker_ dictionary[datum.getId()] = datum;
        } else {
            // replace marker when found
            // what about removing info window?
            this.marker_d ictionary[datum.getId()].detach(); // hide old one
            this.marker_d ictionary[datum.getId()]=datum; // replace the old one
            // the new container will get initialized later
        }
    },
    */
    /*
    getDatumAdpt(id) { // changed to getDatum
        // returns a object that contains id and data
        let rc = false;
        rc = this.marker_ dictionary[id];
        if (!rc) {
            rc = false;
        }
        return rc;
    },
    */
    /*
    async aadAdopteePost(token,owner, id ,form, graph=false) {
      // [ POST to Adoptee Service ]
      if (graph) {
        graph.addRequestService('PUT',this.name)
      }

      // const aadUrl = process.env.AAD_API_URL + '/signup';
      const aadUrl = `${process.env.AAD_API_URL}/adoptee/${owner}/${id}`;
      const aadBody = form;
      const aadHeader = JSON.stringify(this.aadHeader);

      // [ Use the User's Token ]
      aadHeader.authorization = `Bearer ${token}`;

      return await this.$axios({
        url: aadUrl,
        method: 'post',
        headers: aadHeader,
        data: aadBody });
    },
    */
    /*
    async aadAdopteePut(token,owner,id,form, graph=false) {
      if (graph) {
        graph.addRequestService('PUT',this.name)
      }

      const aadUrl = `/adopter/${owner}/${id}`;
      const aadHeader = JSON.stringify(this.aadHeader);
      aadHeader.authorization = `Bearer ${token}`;
      const response = await this.$axios({
        url: aadUrl,
        method: 'put',
        headers: aadHeader,
        data: aadBody });
    },
    */
    /*
       upsert
       owner is the owner identity value
       id is '0' or identity value
       formContainer is object/class wrapper that has id and data
    */
    upsertAdpt(token, owner, id, formContainer) {

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
    /*
       delete
       owner is the owner identity value
       id is identity value
    */
    deleteAdpt(token, owner, id) {
        const atoken = token;
        const aid = id;
        const aadHeader = {
            "Accept":"application/json",
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        // [Assemble Route]
        const _infowindow = this.info_window;
        const aadUrl = `${process.env.AAD_API_URL}/adoptee/${owner}/${id}`;

        let mapHelper = new MapHelper(this);
        const infoHelper = new InfoHelper(true);

        let image = mapHelper.markerImage(DrainTypes.orphan);

        new AADHandlers(this).aadAdopteeDelete(aadUrl, aadHeader)
        .then((response) => {

            // let datum = this.getDatumAdpt(aid);
            let datum = this.getDatum(aid);

            let data = datum.getDataCopy();

            this.setDatumAdpt(new OrphanDatum(aid, data, this));
            // this.getDatumAdpt(aid).show(this.map);
            if (this.map) {
                this.getDatum(aid).show(this.map);
            }
        })

        .catch((response) => {
            console.error('Unexpected issue removing orphan!');
            // eslint-enable no-console
        }) // end of AADHandler

    },
    /*
    insertAdpt(token, owner, formContainer) {
         // [Setup Authorization]
        const atoken = token;
        const aadHeader = {
            "Accept":"application/json",
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        // [Assemble Route]
        const ainfowindow = this.info_window;
        const id = formContainer.id;
        const aadUrl = `${process.env.AAD_API_URL}/adoptee/${owner}`;
        const aadData = formContainer.data;

        aadData['type'] = DrainTypes.adoptee


        new AADHandlers(this).aadAdopteePost(
            aadUrl,
            aadHeader,
            aadData
            ).then((response) => {
              this.addGlyph(this.down,this.down, this.down);

                let mapHelper = new MapHelper(this);
                // returns the new or updated version
                // grab it and update the buffer

                const infoHelper = new InfoHelper(true);
                let image = mapHelper.markerImage(DrainTypes.yours);

                switch(response.data.status){
                    case '200':
                        this.addGlyph(this.down,`    + <--- (success) + -`, '-> (duplicate) ---> [=] ');
                        this.addGlyph(this.down,'                     + -', '-> (fail) --------> [=] ');

                        // need to replace the drain with Red marker

                        const id = response.data.insertion.form['drain_id'];
                        const data = JSON.parse(JSON.stringify(response.data.insertion.form));
                        const ownerKey = this.payload.key;
                        this.addSpace();

                        this.setDatumAdpt(new YoursDatum(id, data, ownerKey, this));

                        this.addGlyph(' [ Map ] ',     ' [ Mark Drain as Yours ] ');
                        this.addSpace();
                        this.addGlyph(this.down,     ' [ Show Drains ] ');

                        this.getDatum(id).show(this.map);
                        // this.getDatumAdpt(id).show(this.map);

                        // this.refreshMyAdopteeList(atoken, ownerKey) ;

                        this.addSpace();
                        this.addGlyph(this.end,this.end);
                        // console.log(this.get Graph());
                        this.showGraph();

                        break;
                    case '409':
                        // this.addGlyph(this.down,`  (duplicate) >`, '-> fail) ---> [=] ');

                        // console.log(this.get Graph());
                        this.showGraph();

                        console.log('Duplicate');

                        break;
                    default:
                        throw new Error('Bad Adoption');

                }
            })
            .catch((err) => {
                // console.log('response ' , response);
                // eslint-disable no-console
                console.error('Unexpected issue with adoption!');
                this.addError(err);
                this.showGraph();
                // eslint-enable no-console
            }) // end of AADHandler

    },
    */
    updateAdpt(token, owner, id, formContainer){

        const atoken = token;
        const aid = id;
        const ainfowindow = this.info_window;

        const aadHeader = {
            "Accept":"application/json",
            'Authorization': `Bearer ${atoken}`,
            'Content-Type': 'application/json'
        };
        // [Assemble Route]
        const aadUrl = `${process.env.AAD_API_URL}/adoptee/${owner}/${id}`;
        const aadData = formContainer.data ;
        // never store type = DrainTypes.yours change to .adoptee
        aadData.type = DrainTypes.adoptee;

        new AADHandlers(this).aadAdopteePut(
            aadUrl,
            aadHeader,
            aadData
            ).then((response) => {
                // returns the new or updated version
                const id = response.data.updation.form['drain_id'];
                const data = JSON.parse(JSON.stringify(response.data.updation.form));
                const ownerKey = this.payload.key;
                // this.setDatumAdpt(new YoursDatum(id, data, ownerKey, this));
                // this.getDatumAdpt(id).show(this.map);
                this.setDatum(new YoursDatum(id, data, ownerKey, this));
                if (this.map) {
                    this.getDatum(id).show(this.map);
                }
            })
            .catch((response) => {

                console.error('Unexpected issue with adoption!');
                this.addError(err);
                this.showGraph();
                //* eslint-enable no-console
            }) // end of AADHandler
    },
    getViewBox(graph=false) {

      if (graph) {
        // graph.addGlyph();
        graph.addGlyph(this.down, ' [ Create MBR ] ');
        graph.addGlyph(this.down, this.down);
        this.addGlyph(this.down, `  (${this.getNames(this.view_box)}) `);
        graph.addSpace();
      }
        return this.view_box;
    },
    setViewBox ( box ) {
        try {
            // Objective: keep data download from getting too big
            // Strategy: expand or shrink box until a maximum area is just found
            // assume box is too big ... so make smaller first
            box = JSON.stringify(box)
            box = JSON.parse(box)
            const bumpSize = 0.01 // growth ratio
            const dy = box.north - box.south
            const dx = (Math.abs(box.west) - Math.abs(box.east))
            let area_ = dy * dx
            let bumpY = dy * bumpSize
            let bumpX = dx * bumpSize
            // make smaller
            while (area_ > this.max_center_box_area) {
                box.north -= bumpY
                box.south += bumpY
                box.west += bumpX
                box.east -= bumpX
                area_ = (box.north - box.south) * (Math.abs(box.west) - Math.abs(box.east))
            }
            // make just a little bigger
            while (area_ < this.max_center_box_area) {
                box.north += bumpY
                box.south -= bumpY
                box.west -= bumpX
                box.east += bumpX
                area_ = (box.north - box.south) * (Math.abs(box.west) - Math.abs(box.east))
            }
            this.view_box = box;
      } catch(err) {
          console.error('setViewBox ', err);
      }
    },
    toggleMarkers(graph=false) {
      if (graph) {
        graph.addGlyph(graph.down, ' [ Toggle Markers ] ');
        graph.addGlyph(graph.down, graph.down);
      }
        for (let i in this.dictionary) {
            let datum = this.getDataAdpt()[i];
            let id = datum.getId();
            let data = datum.getDataCopy();
            let owner = datum.getKey();
            if (this.isAuthenticated) {
                let isYours = (this.payload.key === datum.getKey());
                if (datum.toggleState() === 2 && isYours){
                    // upgrade marker to RED and change info window
                    this.setDatumAdpt(new YoursDatum(id, data, owner, this));
                } else if (datum.toggleState() === 2) {
                    // keep gray marker, update info window
                    this.setDatumAdpt(new AdopteeDatum(id, data, owner, this));

                } else if (datum.toggleState() === 1) {
                    // keep blue marker, change info window
                    this.setDatumAdpt(new OrphanDatum(id, data, this));

                } else {
                    console.log('toggleMarkers Unknown', datum);
                }
            } else {
                switch(datum.toggleState()) {
                    case 1:
                        this.setDatumAdpt(new OrphanDatum(id, data, this));

                        break;
                    case 2:
                        this.setDatumAdpt(new AdopteeDatum(id, data, owner, this));

                        break;
                    case 3:
                        this.setDatumAdpt(new AdopteeDatum(id, data, owner, this));

                        break;
                }

            }
        }
    },
    /*
    getMap() {
        return this.map;
    },
    */
    /*
    setMap(map){
      if (this.graph) {
        this.addGlyph(this.down,' [ Set Map ] ');
        this.addSpace();
      }
      this.map = map;
    },
    */
    /*
    show Symbols(graph=false) {

        try {

            if (graph) {
              graph.addGlyph(' [ Display Symbols ] .',' [ Symbolize ] ');
              graph.addSpace();
            }
            this.counter = 0;
            if (this.datumDictionary) {
              console.log('show Symbols ',this.datumDictinary.getDictionary());
              for (let i in this.datumDictinary.getDictionary()) {
                  let datum = this.getDataAdpt()[i];

                  datum.show(this.map, this);
                  this.counter ++;

              } // for
            }
            if (graph) {
              graph.addGlyph(graph.down,  graph.down, ` [ Processed ${this.counter} Symbols ] `);
              graph.addSpace();
              graph.addEnd();
            }
        } catch(err) {
          console.error('show Symbols ', err);
        }
    },
    */
    /*
    depcleanCache(centerBox, graph=false) {
        //  Objective: minimize the number of drains in the application at one time
        //  Strategy: disable and remove markers not found in the centerBox
        if (graph) {
          graph.addGlyph(graph.down, graph.down);
          graph.addGlyph(graph.down, ' [ Clean Cache ] ');
          graph.addGlyph(graph.down, graph.down);
        }
        this.info_window.close();
        let datum ;
        for(let i in this.dictionary) {
          datum = this.getDataAdpt()[i];
          // turn off when outside the box
          if (
            centerBox.north < datum.getLat() ||
            centerBox.south > datum.getLat() ||
            centerBox.west > datum.getLon() ||
            centerBox.east < datum.getLon()
          ) {

            // for visual effect, hide markers before deleting
            datum.hide();

            // remove drain from dictionary ... this does not delete from db
            delete this.getDataAdpt()[datum.id];

          }
        }

      },
      */
      /*
    loadAdpt (centerBox, grph=false) {
        // load drains into dictionary
        // token is a user token
        // aadData is a rectangle of the current view,
        const graph = grph;

        const mapHelper = new MapHelper(this);

        const aadAuthentecated = this.isAuthenticated;

        const aadData = JSON.parse(JSON.stringify(centerBox));

        const aadUrl = `${process.env.AAD_API_URL}/adoptee/mbr`;

        const aadHeader = {
            "Accept":"application/json",
            'Authorization': `Bearer ${process.env.AAD_API_TOKEN}`,
            'Content-Type': 'application/json'
        };
        // console.log('loadAdpt 6');


        // console.log('AdoptHandler');

        const mbr = this.getViewBox(this.graph);

        this.aad AdopteeGetMBR(mbr, this.graph)

            .then((response) => {
                /////////////////
                // load adoptees
                ///////
                if (graph) {
                  graph.addResponseService('GET', 'Adoptee', '[adoptee,...]');
                  graph.addGlyph(graph.down, graph.down);
                  graph.addGlyph(graph.down, ' [ Cache Adpotee ] ');
                }

                let dr = {};
                for (dr in response.data.selection) {

                    let id=response.data.selection[dr].form.drain_id;
                    let data=response.data.selection[dr].form;
                    let ownerKey=response.data.selection[dr].owner;
                    // let isYours = (this.payload.key !== '0' && this.payload.key === datum.getKey());

                    let datum = null;
                    if (aadAuthentecated) {
                        if (this.payload.key === ownerKey) {
                            // this one has been adopted by you
                            // datum.setType(DrainTypes.yours);
                            // datum = new YourDatum();
                            datum = new YoursDatum(id, data, ownerKey, this);
                        } else {
                            datum = new AdopteeDatum(id, data, ownerKey,this);
                        }
                    } else {
                        datum = new AdopteeDatum(id, data, ownerKey,this);
                    }

                    this.setDatumAdpt(datum); // this drain is not on the map yet
                    // AADHandlers_cnt++
                } // for
                //////////////
                // Prepare to load orphans
                ///////
                this.cleanCache(centerBox, graph);
                // prepare data.world query string

                const queryStr = 'select * from %x where (dr_lon > %w and dr_lon < %e) and (dr_lat > %s and dr_lat < %n)'
                .replace('%x', process.env.DW_TABLE)
                .replace('%w', centerBox.west)
                .replace('%e', centerBox.east)
                .replace('%n', centerBox.north)
                .replace('%s', centerBox.south);

                // pull data.world parameters together
                const data = { query: queryStr, includeTableSchema: false }
                const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer %s'.replace('%s', process.env.DW_AUTH_TOKEN)
                }
                //////////////
                // call the data.world service once adoptees are loaded
                /////////
                // [Merge adoptees and drains]
                if (graph) {
                  graph.addGlyph(graph.down, '  (centerBox) ');
                  graph.addGlyph(graph.down, graph.down);
                  graph.addRequestService('GET', 'Drain');
                }
                // graph.addGlyph(graph.down, '      + ---> (request) >','> [[ Drain Service ]] ');
                // graph.addGlyph(graph.down, '                         ',graph.down);
                //////////

                this.dwDrainRequest()
                .then((response) => {
                  if (graph) {
                    graph.addResponseService('GET','Drain', '[drain,...]')

                    graph.addGlyph(graph.down, graph.down);
                    graph.addGlyph(graph.down, ' [ Cache Drains ] ');
                    graph.addGlyph(graph.down, graph.down);
                  }
                    const tokenHelper = this.current_token_helper

                    let dr = {}
                    ///////////////
                    // load orphans, marker, and set infowindow
                    ////////
                    for (let i in response.data) {
                        // turn on or add to drains
                        // turn on markers where map is null

                        let dr = response.data[i];
                        let id = dr['dr_asset_id'];
                        // let _drain = this.getDatumAdpt(id);
                        let _drain = this.getDatum(id);

                        if (!_drain) {
                            const data={
                                type: DrainTypes.orphan ,
                                lat: dr['dr_lat'],
                                lon: dr['dr_lon'],
                                drain_id: id,
                                name: 'name me'
                            };
                            let datum = new OrphanDatum(id, data, this);
                            this.setDatumAdpt(datum);
                        }

                    } // end for
                    this.set Feedback(`Found ${this.getDataCount()} Storm Drains`);
                    this.show Symbols(graph);
                    this.showGraph();
                    // console.log(graph.get Graph());
                })
                .catch((err) => {
                    // eslint-disable no-console
                    console.error('Unexpected issue loading drains!', err);
                    if (graph) {
                      graph.addError(err);
                      graph.showGraph();
                    }
                    // eslint-enable no-console
                }); // end of DWHandlers
                ///////////
                //////////
                //////////
            })
            .catch((err) => {
                // eslint-disable no-console
                console.error('Unexpected issue with adoptees!', err);
                if (graph) {
                  graph.addError(err);
                  graph.showGraph();
                }
                // eslint-enable no-console
            }); //

    }, // loadAdpt
    */
    /*
    loadMyAdopteeList(token, owner, graph=false) {
        // token is a user token
        // owner is key value
        // to persist the list add my_adoptee_list to your component's data section
        console.log(`
             (owner)
                |
             [loadMyAdpt]
                |
             (aadUrl, aadHeader, aadData)
                |
             [My Adoptee Request]
                .
                .
                .
        `);
        const aadAuthentecated = this.isAuthenticated;
        // const aadData = JSON.parse(JSON.stringify(centerBox));
        const aadUrl = `${process.env.AAD_API_URL}/adoptee/${owner}`;

        const aadHeader = {
            "Accept":"application/json",
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        new AADHandlers(this).aad AdopteeGet(
            aadUrl,
            aadHeader)
            .then((response) => {
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
            })
            .catch((err) => {
                // eslint-disable no-console
                console.error('Unexpected issue with adoptee list!', err);
                // eslint-enable no-console
            });
    },
    */
    /*
    refresh MyAdopteeList(token, owner) {
        // token is a user token
        // owner is key value
        // to persist the list add my_adoptee_list to your component's data section
        console.log(`
             (owner)
                |
             [loadMyAdpt]
                |
             (aadUrl, aadHeader, aadData)
                |
             [My Adoptee Request]
                .
                .
                .
        `);
        // console.log('refreshMyAdopteeList token ', token);
        // console.log('refreshMyAdopteeList owner ', owner);

        const aadAuthentecated = this.isAuthenticated;
        // const aadData = JSON.parse(JSON.stringify(centerBox));
        const aadUrl = `${process.env.AAD_API_URL}/adoptee/${owner}`;

        const aadHeader = {
            "Accept":"application/json",
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        new AADHandlers(this).aad AdopteeGet(
            aadUrl,
            aadHeader)
            .then((response) => {
                let save = false;
                if (this.my_adoptee_list) {
                  save = true;
                  this.my_adoptee_list.length = 0;
                }
                // console.log('save ', save);
                console.log('aad AdopteeGet response ', response.data.selection);
                for (let i in response.data.selection) {
                    if (save) {
                        console.log('i ', response.data.selection[i]);
                        this.my_adoptee_list.push(response.data.selection[i]);
                    }
                }
            })
            .catch((err) => {
                // eslint-disable no-console
                console.error('Unexpected issue with adoptee list!', err);
                // eslint-enable no-console
            });
    },
    */
    /*
    getMyAdopteeList(token, owner) {
        // token is a user token
        // owner is key value

        console.log(`
             (owner)
                |
             [loadMyAdpt]
                |
             (aadUrl, aadHeader, aadData)
                |
             [My Adoptee Request]
                .
                .
                .
        `);
        const aadAuthentecated = this.isAuthenticated;
        // const aadData = JSON.parse(JSON.stringify(centerBox));
        const aadUrl = `${process.env.AAD_API_URL}/adoptee/${owner}`;

        const aadHeader = {
            "Accept":"application/json",
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        new AADHandlers(this).aad AdopteeGet(
            aadUrl,
            aadHeader)
            .then((response) => {
                console.log('response ', response.data.selection);
                for (let i in response.data.selection) {
                    //console.log('i ', response.data.selection[i]);
                    this.my_adoptee_list.push(response.data.selection[i]);
                }
            })
            .catch((err) => {
                // eslint-disable no-console
                console.error('Unexpected issue with adoptee list!', err);
                // eslint-enable no-console
            });

        return this.my_adoptee_list;
    }
    */
  }
}
