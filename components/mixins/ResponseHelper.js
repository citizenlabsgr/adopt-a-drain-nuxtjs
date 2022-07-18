
class ResponseHelper {

    constructor(response) {
        this.response = response;
    }

    method() {
        return this.response.config.method;
    }

    status() {
        let rc = false;
        if (this.response.status === 200) {
            rc = "200";
            if (this.response.data) {
                if (this.response.data.status) { 
                    rc = this.response.data.status;
                }
            }
        }
        return rc;
    }

    msg() {
        let rc = false;
        if (this.response.status === 200) {
            rc = "OK";
            if (this.response.data) {
                if (this.response.data.msg) {
                    rc = this.response.data.msg;
                }
            }
        }
        return rc;
    }
    
    data() {
        // handle get, post, put, delete 
        // expect contents below data.selection, data.insertion, data.deletion, data.updation
        // service interfaces are inconsistant
        // console.log('    ResponseHelper data 1');
        let rc = false;
        // console.log('    ResponseHelper data 2');

        let d = this.response.data;
        // console.log('    ResponseHelper data 3');

        rc = `(${this.status()})`;
        // console.log('    ResponseHelper data 4', this.method().toLowerCase());

        switch (this.method().toLowerCase()) {
            case 'post':
                // console.log('        helper data 4.1');
                if (this.status() === '200') {
                    if (this.response) {
                        if (this.response.data) {
                            // adjust for inconsistant the source services
                            // be better!
                            if (this.response.data.insertion) {    
                                rc = this.response.data.insertion;
                            } else if (this.response.data.selection) {
                                rc = this.response.data.selection;
                            } else {
                                rc = this.response.data;
                            }
                        }
                    } 
                }  else if (this.status() === '409') {
                    // console.log('        helper data 4.1.3');

                    rc = {duplicate: 'Duplicate'};
                }
                break;
            case 'put':
                // console.log('        ResponseHelper data 4.2');

                rc = this.response.data.updation;
                break;
            case 'get':
                // console.log('        ResponseHelper data 4.3');

                rc = this.response.data.selection;
                break;
            case 'delete':
                // console.log('        ResponseHelper data 4.4');

                rc = this.response.data.deletion;
                break;
        }
        // console.log('ResponseHelper out');
        return rc;
    } // end data

    getValue(keys, valueObject) {
        // expect valueObject to be a dictionary
        // given data: [{name: "JTW"}]
        // arrays are refed like "data.0.name"
        let rc = '';
        let path = keys.split('.');
        // console.log('valueObject ', valueObject);
        // console.log('path ', path);
        switch(path.length) {
            case 1:
                rc = valueObject[path[0]];
            break;
            case 2:
                rc = valueObject[path[0]][path[1]];
            break;
            case 3:
                rc = valueObject[path[0]][path[1]][path[2]];
            break;
            case 4:
                rc = valueObject[path[0]][path[1]][path[2]][path[3]];
                break;
            case 5:
                rc = valueObject[path[0]][path[1]][path[2]][path[3]][path[4]];
                break;
            case 6:
                rc = valueObject[path[0]][path[1]][path[2]][path[3]][path[4]][path[5]];
                break;    
            default:
                throw new Error(`Unknown path ${keys}`);
        }
        return rc;
    }
    resetOutput(output) {
         // reset output array when needed
         if (Array.isArray(output)) { // list to list
            // stash first 
            output.length = 0; // reset list
        } 
    }
    transfer(mapping, output) {
        // console.log('transfer 1');
        // rrmo is {request, response, mapping, output}

        // console.log('transfer mapping ', mapping);
        
        // console.log('transfer data() ', this.data());        
        // console.log('transfer data type ', typeof this.data());
        // console.log('transfer data isArray ', Array.isArray(this.data()));

        // console.log('transfer output type ', typeof output);
        // console.log('transfer output isArray ', Array.isArray(output));
        
        let inArray = Array.isArray(this.data());
        let outArray = Array.isArray(output);
        // reset output array when needed
        // if (outArray) { // list to list
        //     // stash first 
        //     output.length = 0; // reset list
        // }    
        for (let i =0; i < this.data().length; i++) {

            // console.log('i ', i, ' ', this.data()[i]);
            
            let datum = {}; 
            let values = this.data()[i];
            for (let key of Object.keys(mapping)) {
                // get from key
                let frKey = mapping[key];
                // get from value 
                let frVal = this.getValue(frKey, values);    
                // assign data to output
                datum[key] = frVal; 
            }    
            // console.log('datum ', datum);
            if (inArray && outArray) { // list to list, [] -> []
                // assume first item is 
                // append
                // console.log('A inn && out push ', datum);
                // make independent copy 
                output.push(JSON.parse(JSON.stringify(datum)));
            } else if(inArray && !outArray) { // list to dictionary [] -> {}
                // assign last in array  
                // at this point, datum has same keys as mapping 
                // trans last row of data
                // console.log('B inn && not out ', datum);

                for (let key of Object.keys(datum)) {
                    output[key] = datum[key]
                }

            } else if (!inArray && !outArray) { // dictionary to dictionary, {} -> {}
                // assign
                // console.log('!inn && !out assign');
                // merge datum into output
                // leaves output keys not in datum
                // adds datum items not defined in output
                // copy datum obects via copy 

                for (let key of Object.keys(datum)) {
                    if (typeof datum[key] === "object") {
                        output[key] = JSON.parse(JSON.stringify(datum[key]));
                    } else {
                        output[key] = datum[key]
                    }
                }
            }
        }
        // console.log('output', output);
        // dont use return output, output gets changed on return 
        // return output;
    }
}

export { ResponseHelper }