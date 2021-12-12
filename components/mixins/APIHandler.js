// import atob from 'atob';
import { AADHandlers } from '@/components/mixins/AADHandlers.js'
import { DrainTypes } from '@/components/mixins/DrainTypes.js'
import { MapHelper } from '@/components/mixins/MapHelper.js'
import { InfoHelper } from '@/components/mixins/InfoHelper.js'
export default {
  data () {
    return {
        local_dictionary: {},
        lastResult: {}
    }
  },

  methods: {
    getData() {
        return this.local_dictionary;
    },
    setDatum(formContainer) {
        if (!formContainer.data) {
            throw new Error('Object missing data attribute!');
        }
        this.local_dictionary[formContainer.id]=formContainer;
    },
    getDatum(id) {
        // returns a object that contains id and data
        return this.local_dictionary[id];
    },
    /*
       upsert
       owner is the owner identity value
       id is '0' or identity value 
       formContainer is object/class wrapper that has id and data
    */
    upsert(token, owner, id, formContainer){

        if (!formContainer.data) {
            throw new Error('Object must contain data attribute!');
        }
        if (!formContainer.id) {
            throw new Error('Object must contain id attribute!');
        }
        if (id === '0') {
            this.insert(token, owner, formContainer);
        } else {
            this.update(token, owner, id, formContainer);
        }
    },
    remove(token, owner, id) {
        // console.log('delete ', owner, id);
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
            // set local drain name
            // mark as yours
            let image = mapHelper.markerImage(DrainTypes.orphan);
            let drain = this.getDatum(aid);
            // change data in buffer
            
            drain.setData(this.utils.copyWithout(response.data.deletion.form,["id","adopter_key"]))
                .setType(DrainTypes.orphan)
                .setIcon(image);

            drain.setMarkerListener(_infowindow,
                                    infoHelper.form(drain));
            })
        .catch((response) => {
            //this.feedback('Unexpected issue with adoption!')
            // eslint-disable no-console 
            // console.error('Unexpected issue with deletion!');
            // console.error('aadUrl    ', aadUrl);
            // console.error('aadHeader ', aadHeader);

            // eslint-enable no-console 
        }) // end of AADHandler
        
    },
    insert(token, owner, formContainer) {
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
                    let drain = this.getDatum(id);
                    drain.merge(response.data.insertion.form);

                    drain.setType(DrainTypes.yours)
                        .getMarker().setIcon(image);
                    
                    let form = infoHelper.form(drain);
                    drain.setMarkerListener(ainfowindow, form);
                    break;
                case '409':
                    console.log('Duplicate'); 
                    break;
                default: 
                    throw new Error('Bad Adoption');    
            }
            })
            .catch((response) => {
                // console.log(response);
                // console.error('aadUrl     ',aadUrl);
                // console.error('aadHeader  ',aadHeader);
                // console.error('aadData    ',aadData);
                /* eslint-disable no-console */
                console.error('Unexpected issue with adoption!');
                /* eslint-enable no-console */
            }) // end of AADHandler

    },
    update(token, owner, id, formContainer){
        // console.log('update ', owner, id, formContainer);

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
                // grab it and update the buffer
                let mapHelper = new MapHelper(this);
                const infoHelper = new InfoHelper(true);

                // reset marker to yours
                let image = mapHelper.markerImage(DrainTypes.yours)

                switch(response.data.status){
                    case '200':
                        let drain = this.getDatum(aid);
                        drain.merge(response.data.updation.form);
                        drain.setType(DrainTypes.yours)
                            .getMarker().setIcon(image);
                        let form = infoHelper.form(drain);
                        drain.setMarkerListener(ainfowindow, form);
                        break;
                    
                    default: 
                        throw new Error('Bad Adoption');    
                }
            })
            .catch((response) => {
                //* eslint-disable no-console 
                console.error('Unexpected issue with adoption!');
                //* eslint-enable no-console 
            }) // end of AADHandler      
    }
  }
}
