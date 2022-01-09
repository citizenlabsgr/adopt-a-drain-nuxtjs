// namespace prefix Adoptee is Adpt
import { AADHandlers } from '@/components/mixins/AADHandlers.js'
import { DrainTypes } from '@/components/mixins/DrainTypes.js'
import { MapHelper } from '@/components/mixins/MapHelper.js'
import { InfoHelper } from '@/components/mixins/InfoHelper.js'
import { DWHandlers } from '@/components/mixins/DWHandlers.js'
// import { Datum } from './Datum'
import { OrphanDatum } from './DatumOrphan'
import { AdopteeDatum } from './DatumAdoptee'
import { YoursDatum } from './DatumYours'
export default {
  data () {
    return {
       // local_dictionary: { }, // you, I will kill last.
        marker_dictionary: {},
        lastResult: {},
        max_center_box_area: 0.00005,
        view_box: {},
        delay: 20,
        counter: 0,
        info_window: null,
        map:null
    }
  },

  methods: {
    getDataCount() {
        return Object.keys(this.marker_dictionary).length;
    },
    getDataAdpt() { 
        return this.marker_dictionary;
    },
    setDatumAdpt(datum) {
        // formContainer could be drain but doesnt have to be
        // never let drains with map stuff attached get loaded
        // dont overwrite existing drains those may have map info, image, and ...

        if (!datum || !datum.data) {
            throw new Error('Object missing data attribute!');
        }
        // if (this.marker_dictionary[datum.getId()]) { // replace old
        if (!this.getDatumAdpt(datum.getId())) {    
            // add marker when not available
            this.marker_dictionary[datum.getId()] = datum;
        } else {
            // replace marker when found
            // what about removing info window?
            this.marker_dictionary[datum.getId()].detach(); // hide old one
            this.marker_dictionary[datum.getId()]=datum; // replace the old one
            // the new container will get initialized later
        } 
    },
    getDatumAdpt(id) {
        // returns a object that contains id and data
        let rc = false;        
        rc = this.marker_dictionary[id];
        if (!rc) {
            rc = false;
        }
        return rc;
    },
    /*
       upsert
       owner is the owner identity value
       id is '0' or identity value 
       formContainer is object/class wrapper that has id and data
    */
    upsertAdpt(token, owner, id, formContainer){

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
            
            let datum = this.getDatumAdpt(aid);

            let data = datum.getDataCopy();

            this.setDatumAdpt(new OrphanDatum(aid, data, this));
            this.getDatumAdpt(aid).show(this.map);

        })

        .catch((response) => {
            console.error('Unexpected issue removing orphan!');

            //this.feedback('Unexpected issue with adoption!')
            // eslint-disable no-console 
            // console.error('Unexpected issue with deletion!');
            // console.error('aadUrl    ', aadUrl);
            // console.error('aadHeader ', aadHeader);

            // eslint-enable no-console 
        }) // end of AADHandler
        
    },
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

                let mapHelper = new MapHelper(this);
                // returns the new or updated version
                // grab it and update the buffer
        
                const infoHelper = new InfoHelper(true);

                let image = mapHelper.markerImage(DrainTypes.yours);

                switch(response.data.status){
                    case '200':
                        /*
                        need to replace the drain with Red marker
                        */        
                        const id = response.data.insertion.form['drain_id'];
                        const data = JSON.parse(JSON.stringify(response.data.insertion.form));
                        const ownerKey = this.payload.key;
                        this.setDatumAdpt(new YoursDatum(id, data, ownerKey, this));
                        
                        this.getDatumAdpt(id).show(this.map);
                        break;
                    case '409':
                        console.log('Duplicate'); 
                        break;
                    default: 
                        throw new Error('Bad Adoption');    
                }
            })
            .catch((response) => {
               
                /* eslint-disable no-console */
                console.error('Unexpected issue with adoption!');
                /* eslint-enable no-console */
            }) // end of AADHandler

    },
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
                this.setDatumAdpt(new YoursDatum(id, data, ownerKey, this));
                
                this.getDatumAdpt(id).show(this.map);
                
            })
            .catch((response) => {
                //* eslint-disable no-console 
                // console.error('aadHeader ',aadHeader);
                // console.error('aadUrl    ',aadUrl);
                // console.error('aadData   ',aadData);
 
                console.error('Unexpected issue with adoption!');
                //* eslint-enable no-console 
            }) // end of AADHandler      
    },
    getViewBox() {
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
    toggleMarkers() {
        console.log(`             
        [toggle markers]
           |
        `);
        for (let i in this.marker_dictionary) {
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
    
    setMap(map){
      this.map = map;
    },

    showSymbols() {
        
        try {
            // let infoHelper = new InfoHelper(this.isAuthenticated);
            // const mapHelper = new MapHelper(this); 
            // const map = mapHelper.map
            // const info_window = this.info_window;
            //let counter = 0;

            console.log(`
                |
            [showSymbols] <--- [getDataAdpt] <--- +
                |                  |              |
                |               (datum)           |
                |                  |              |
                |               [showDatum] ----> +  
                =
            `);
            this.counter = 0;
            for (let i in this.marker_dictionary) {    
                let datum = this.getDataAdpt()[i];
                
                datum.show(this.map, this); 
                this.counter ++;
                
            } // for
            
        } catch(err) {
          console.error('showSymbols ', err); 
        }
    },

    cleanCache(centerBox) {
        //  Objective: minimize the number of drains in the application at one time
        //  Strategy: disable and remove markers not found in the centerBox
        console.log(`
             (centerBox)
                |
             [cleanCache] <--- [getDataAdpt] <------------- +
                |                   |                         |
                |                (datum)                      |
                |                   |                         |
                |                [centerBox] ---> ((in)) ---> +   
                |                   |                         |
                |                ((out))                      |
                |                   |                         |
                |                [delete (datum)] ----------> +
        `);
        this.info_window.close();
        let datum ;
        for(let i in this.marker_dictionary) {
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
    loadAdpt (centerBox) {
        // load drains into marker_dictionary 
        // token is a user token
        // aadData is a rectangle of the current view, 
        console.log(`
             (centerBox)
                |
             [loadAdpt]
                |
             (aadUrl, aadHeader, centerBox)
                |
             [Adoptee Request]   
                .
                .
                .
        `);
        const mapHelper = new MapHelper(this); 
        const aadAuthentecated = this.isAuthenticated;
        const aadData = JSON.parse(JSON.stringify(centerBox));
        const aadUrl = `${process.env.AAD_API_URL}/adoptee/mbr`;

        const aadHeader = {
            "Accept":"application/json",
            'Authorization': `Bearer ${process.env.AAD_API_TOKEN}`,
            'Content-Type': 'application/json'
        };
        new AADHandlers(this).aadAdopteeGetMBR(
            aadUrl, 
            aadHeader, 
            aadData)
            .then((response) => {
                /////////////////
                // load adoptees
                ///////
             console.log(` 
                .    
                .
                .   
             (adoptee response)
                |
             [Cache Data] <--- [selection] <----------- +
                |                 |                     |
                |              (datum)                  |
                |                 |                     |
                |              [Determine datum type]   |
                |                 |                     |
                |              (datum)                  |
                |                 |                     |
                |              [setDatumAdpt] --------> +
                |
             `);

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
                this.cleanCache(centerBox)
                // prepare data.world query string

                const queryStr = 'select * from %x where (dr_lon > %w and dr_lon < %e) and (dr_lat > %s and dr_lat < %n)'
                .replace('%x', process.env.DW_TABLE)
                .replace('%w', centerBox.west)
                .replace('%e', centerBox.east)
                .replace('%n', centerBox.north)
                .replace('%s', centerBox.south)

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
                console.log(`
             (DW_DRAIN_URL, dwHeaders, dwData)
                |
             [Request Drains]
                .
                .
                .
                `);
                //////////
                new DWHandlers(this).dwDrains(process.env.DW_DRAIN_URL, 
                    headers, 
                    data)
                .then((response) => {
                    console.log(`   
                .
                .
                .
             (drain response)
                |
             [data] <----------- +
                |                |
             (datum)             |
                |                |
             [setDatumAdpt] ---> +
                | 
                    `);

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
                        let _drain = this.getDatumAdpt(id);
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
                    this.setFeedback(`Found ${this.getDataCount()} Storm Drains`);
                    this.showSymbols();
                })
                .catch((err) => {
                    // eslint-disable no-console 
                    console.error('Unexpected issue loading drains!', err);
                    // eslint-enable no-console  
                }); // end of DWHandlers
                ///////////
                //////////
                //////////
            })
            .catch((err) => {
                // eslint-disable no-console 
                console.error('Unexpected issue with adoptees!', err);
                // eslint-enable no-console 
            }); //    
    } // loadAdpt
    
  }
}
