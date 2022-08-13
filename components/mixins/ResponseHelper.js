/*
response :{
  method: "GET" |"POST" | "DELETE" | "PUT",
  status: 'OK'
  config :{ method: "GET"},
  data: {status: "" insertion: [] | selection: [] | deletion: [] || updation: []}
}

 */
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
        // console.log('ResponseHelper rc ',rc);
        // console.log('ResponseHelper out');
        return rc;
    } // end data

    getValue(keys, valueObject) {
        // expect valueObject to be a dictionary
        // given data: [{name: "JTW"}]
        // arrays are refed like "data.0.name"
        let rc = '';
        // console.log('getValue keys ', keys);
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
              // console.log('path ', path);
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
        // console.log('transfer mapping ', mapping);
        // console.log('transfer x');
        // console.log('transfer output ', output);

        // console.log('transfer data() ', this.data());
        // console.log('transfer data type ', typeof this.data());
        // console.log('transfer data isArray ', Array.isArray(this.data()));

        // console.log('transfer output type ', typeof output);
        // console.log('transfer output isArray ', Array.isArray(output));
        // console.log('transfer 1.1 ', this.data());

        let inArray = Array.isArray(this.data());
        // console.log('transfer 1.2 ', output);

        let outArray = Array.isArray(output);
        // reset output array when needed

         // console.log('transfer 2');
        for (let i =0; i < this.data().length; i++) {
          // console.log('i ', i);

          // console.log('i ', i, ' ', this.data()[i]);

            let datum = {};
            let values = this.data()[i];
            for (let key of Object.keys(mapping)) {
                // console.log('  key ', key);
                // get from key
                let frKey = mapping[key];
                // get from value
                let frVal = this.getValue(frKey, values);
                // console.log('  key ', key , ' frKey ', frKey, ' frVal ', frVal);
                // assign data to output
                datum[key] = frVal;
            }

            // console.log('transfer datum ', datum);
            if (inArray && outArray) { // list to list, [] -> []
               // console.log('transfer 3');
                // assume first item is
                // append
                // console.log('transfer A inn && out push ', datum);
                // make independent copy
                output.push(JSON.parse(JSON.stringify(datum)));

                // console.log('transfer output ',output[output.length-1]);

              // console.log('transfer 3.1');
            } else if(inArray && !outArray) { // list to dictionary [] -> {}
                // assign last in array
                // at this point, datum has same keys as mapping
                // trans last row of data
                // console.log('B inn && not out ', datum);
                // console.log('transfer 4');

                for (let key of Object.keys(datum)) {
                  // console.log('transfer 4.1');

                    output[key] = datum[key]
                }

            } else if (!inArray && !outArray) { // dictionary to dictionary, {} -> {}
               // console.log('transfer 5');
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
        // console.log('transfer out');
        // console.log('output', output);
        // dont use return output, output gets changed on return
        // return output;
    }
}

export { ResponseHelper }
